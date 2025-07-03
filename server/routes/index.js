const router = require('express').Router();

router.use('/auth',      require('./authRoutes'));
router.use('/citations', require('./citationsRoutes'));
router.use('/diapos',    require('./diaposRoutes'));
router.use('/contrats',  require('./contratsRoutes'));
router.use('/fanfarons', require('./fanfaronsRoutes'));
router.use('/users',     require('./userRoutes'));
router.use('/email',     require('./emailRoutes'));

module.exports = router;
