module.exports = (req,res,next) => {
    const date = new Date();

    console.log(`${req.method} | ${req.protocol}://${req.hostname}${req.originalUrl} | ${date}`);
    next();
}