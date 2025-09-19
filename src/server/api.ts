import { ZMember } from '@devvit/protos/.';
import { context, reddit, redis } from '@devvit/web/server';
import { Router } from 'express';
import { MSquare } from 'lucide-react';
import { InitResponse } from '../shared/types/api';
import { resolve } from 'node:path';

const appRouter = Router();

appRouter.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }
    try {
      const username = await reddit.getCurrentUsername();
      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

//get a player score
appRouter.get('/player/score', async (req, res) => {
  //dummy
  const username = await reddit.getCurrentUsername();
  return res.json({ score: 12, accuracy: 45.78, rank: 23, username });
  try {
    const { postId } = context;
    if (!postId) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    const leaderboardKey = `leaderboard:${postId}`;
    const accuracyKey = `${leaderboardKey}:${username}:accuracy`;
    const [rankRaw, scoreRaw, accuracyRaw] = await Promise.all([
      redis.zRank(leaderboardKey, username),
      redis.zScore(leaderboardKey, username),
      redis.hGet(accuracyKey, username),
    ]);

    const accuracy = accuracyRaw ? parseFloat(accuracyRaw) : undefined;
    const rank = rankRaw !== null && rankRaw != undefined ? rankRaw + 1 : undefined;
    const score = scoreRaw;
    if (accuracy && rank && score) {
      return res.json({ score, accuracy, rank, username });
    } else {
      return res.status(404);
    }
  } catch (err) {
    console.error("Couldn't fetch user score");
    res.status(400).json({ status: 'error', message: String(err) });
  }
});

// update player score if needed
appRouter.put('/player/score', async (req, res) => {
  const { postId } = context;
  const { time, accuracy } = req.body;
  if (!postId || time === undefined || accuracy === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const username = await reddit.getCurrentUsername();
  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const leaderboardKey = `leaderboard:${postId}`;
  const accuracyKey = `${leaderboardKey}:${username}:accuracy`;
  const existingTime = await redis.zScore(leaderboardKey, username);

  if (!existingTime || time < existingTime) {
    await redis.zAdd(leaderboardKey, { member: username, score: time });
    await redis.hSet(accuracyKey, accuracy);
  }
  const updatedScore = await redis.zScore(leaderboardKey, username);
  const storedAccuracy = await redis.hGet(accuracyKey, username);
  res.json({
    username,
    time: updatedScore || 0,
    accuracy: storedAccuracy || 0,
  });
});

function dummyPage(page: string, res: any) {
  if (page == '1') {
    return res.json({
      'page': 1,
      'totalPages': 3,
      'entries': [
        {
          'username': 'user1',
          'rank': 1,
          'score': 417,
          'accuracy': 100,
        },
        {
          'username': 'user2',
          'rank': 2,
          'score': 450,
          'accuracy': 85,
        },
        {
          'username': 'user3',
          'rank': 3,
          'score': 155,
          'accuracy': 63,
        },
        {
          'username': 'user4',
          'rank': 4,
          'score': 191,
          'accuracy': 91,
        },
        {
          'username': 'user5',
          'rank': 5,
          'score': 100,
          'accuracy': 71,
        },
      ],
      'isFirst': true,
      'isLast': false,
    });
  } else if (page == '2') {
    return res.json({
      'page': 2,
      'totalPages': 3,
      'entries': [
        {
          'username': 'user6',
          'rank': 6,
          'score': 65,
          'accuracy': 71,
        },
        {
          'username': 'user7',
          'rank': 7,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user8',
          'rank': 8,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user9',
          'rank': 9,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user10',
          'rank': 10,
          'score': 100,
          'accuracy': 71,
        },
      ],
      'isFirst': true,
      'isLast': false,
    });
  } else if (page == '3') {
    return res.json({
      'page': 3,
      'totalPages': 3,
      'entries': [
        {
          'username': 'user11',
          'rank': 11,
          'score': 65,
          'accuracy': 71,
        },
        {
          'username': 'user12',
          'rank': 12,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user13',
          'rank': 13,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user14',
          'rank': 14,
          'score': 100,
          'accuracy': 71,
        },
        {
          'username': 'user15',
          'rank': 15,
          'score': 100,
          'accuracy': 71,
        },
      ],
      'isFirst': true,
      'isLast': false,
    });
  }
}

appRouter.get('/player/scores', async (req, res) => {
  try {
    const { page = '1' } = req.query as { page?: string };
    return dummyPage(page, res);
    const { postId } = context;
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    if (!postId) return res.status(400).json({ error: 'Missing postId' });
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = 5;
    const leaderboardKey = `leaderboard:${postId}`;
    const accuracyKey = `${leaderboardKey}:${username}:accuracy`;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize - 1;

    const members: { member: string; score: number }[] = await redis.zRange(
      leaderboardKey,
      start,
      end
    );
    const totalPlayers = await redis.zCard(leaderboardKey);

    if (members.length === 0) {
      return res.json({ page: pageNum, entries: [], isFirst: pageNum === 1, isLast: true });
    }

    // Fetch accuracy, score, and rank sequentially
    const results: Array<{ username: string; time: number; accuracy: number; rank: number }> = [];

    for (const m of members) {
      const [accuracyStr, rankNum] = await Promise.all([
        redis.hGet(accuracyKey, m.member),
        redis.zRank(leaderboardKey, m.member),
      ]);

      results.push({
        username: m.member,
        time: m.score,
        accuracy: accuracyStr ? parseFloat(accuracyStr) : 0,
        rank: rankNum !== null && rankNum != undefined ? rankNum + 1 : -1,
      });
    }

    const totalPages = Math.ceil(totalPlayers / pageSize);

    res.json({
      page: pageNum,
      totalPages: totalPages,
      entries: results,
      isFirst: pageNum === 1,
      isLast: pageNum >= totalPages,
    });
  } catch (err) {
    console.error("Couldn't fetch leaderboard data:", err);
    res.status(400).json({ status: 'error', message: String(err) });
  }
});

export default appRouter;
