class MorganFormatConfig {
    static get FORMAT() {
        return {
            DEV: 'dev', //IN DEVELOPMENT ENVIRONMENT
            COMBINED: 'combined', //IN PRODUCT ENVIRONMENT
            COMMON: 'common',
            SHORT: 'short',
            TINY: 'tiny',
        }
    }
}

module.exports = MorganFormatConfig;