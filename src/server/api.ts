import { context, reddit, redis } from "@devvit/web/server";
import { Router } from "express";
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
    const accuracyKey = `${leaderboardKey}:accuracy:${username}`;
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



export default appRouter