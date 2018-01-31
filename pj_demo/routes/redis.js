exports.get = async function(ctx) {
    
   await redis.set('key', '123456');
   ctx.body = await redis.get('key');
}