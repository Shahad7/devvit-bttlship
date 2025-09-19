import { ZMember } from "@devvit/protos/.";
import { context, reddit, redis } from "@devvit/web/server";
import { Router } from "express";
import { MSquare } from "lucide-react";
import { InitResponse } from "../shared/types/api";

const appRouter = Router()

appRouter.get<{ postId: string }, InitResponse | { status: string; message: string }>(
    '/api/init',
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
        const username  = await reddit.getCurrentUsername()
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


appRouter.put('/api/player/score', async (req, res) => {
    const {postId} = context
    const {  time, accuracy } = req.body; 
    if (!postId || time === undefined || accuracy === undefined) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const username = await reddit.getCurrentUsername();
    if (!username) {
        return res.status(401).json({ error: "Not logged in" });
    }
    const leaderboardKey = `leaderboard:${postId}`;
    const accuracyKey = `${leaderboardKey}:${username}:accuracy`;
    const existingTime = await redis.zScore(leaderboardKey, username);

    if (!existingTime || time < existingTime) {
        await redis.zAdd(leaderboardKey, {member:username,score:time});
        await redis.hSet(accuracyKey, accuracy);
    }
    const updatedScore = await redis.zScore(leaderboardKey, username);
    const storedAccuracy = await redis.hGet(accuracyKey, username);
    res.json({
        username,
        time: (updatedScore || 0),
        accuracy:(storedAccuracy || 0)
    });
});

appRouter.get('/api/player/scores', async (req, res) => {
    try {
      const { page = '1' } = req.query as { page?: string };
      const { postId } = context;
      const username = await reddit.getCurrentUsername();
      if (!username) {
        return res.status(401).json({ error: "Not logged in" });
      }
      if (!postId) return res.status(400).json({ error: "Missing postId" });
      const pageNum = parseInt(page, 10) || 1;
      const pageSize = 5;
      const leaderboardKey = `leaderboard:${postId}`;
      const accuracyKey = `${leaderboardKey}:${username}:accuracy`;
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize - 1;
  
      const members:{ member: string; score: number;}[] = await redis.zRange(leaderboardKey, start, end);
      const totalPlayers = await redis.zCard(leaderboardKey);
  
      if (members.length === 0) {
        return res.json({ page: pageNum, entries: [], isFirst: pageNum === 1, isLast: true });
      }
  
      // Fetch accuracy, score, and rank sequentially
      const results: Array<{ username: string; time: number; accuracy: number; rank: number }> = [];
  
      for (const m of members) {
        const [accuracyStr, rankNum] = await Promise.all([
          redis.hGet(accuracyKey, m.member),
          redis.zRank(leaderboardKey,  m.member),
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
        totalPages:totalPages,
        entries: results,
        isFirst: pageNum === 1,
        isLast: pageNum >= totalPages,
      });
    } catch (err) {
      console.error("Couldn't fetch leaderboard data:", err);
      res.status(400).json({ status: 'error', message: String(err) });
    }
  });
  


export default appRouter