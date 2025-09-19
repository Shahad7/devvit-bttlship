import { context, reddit, redis } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  const postCount = await redis.get('postCount')
  await redis.incrBy('postCount',1)
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'bttlship',
      appIconUri: 'icon.svg',
      description:
        'Battleship is a single-player challenge on the classic naval strategy game. Test your precision and speed as you hunt down enemy ships hidden on a 10×10 grid. Every move counts: your final score is based on both time taken and shot accuracy. Can you sink the fleet faster and cleaner than anyone else? Climb the high-score leaderboard and prove your mastery of the seas!',
    },
    subredditName: subredditName,
    title: postCount!=undefined ? `bttlship#${postCount}` : `bttlship`,
  });
};
