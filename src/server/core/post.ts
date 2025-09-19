import { context, reddit, redis } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  const postCount = await redis.get('postCount');
  await redis.incrBy('postCount', 1);
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'Battleship',
      appIconUri: 'icon.png',
      buttonLabel: 'Play Now',
      description:
        'A solo naval challenge on a 10×10 grid. Sink the fleet fast, beat the clock, and rise on the leaderboard',
    },
    subredditName: subredditName,

    title: postCount != undefined ? `Battleship#${postCount}` : `Battleship`,
  });
};
