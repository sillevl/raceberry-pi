/**
 * Settings
 */

module.exports = {
	http: {
		port: 80
	},
	websocket: {
		port: 45679
	},
  mbed: {
      port: 1337,
      address: '224.12.24.36'
  },
  detector: {
    clear: 33,          // Clear pin number
    input: 31           // Input pin number
  },
  i2c: {
    address: 0x60,          // 7 bit address for linux
    device: '/dev/i2c-1'
  },
  pololu:{
      code: 337
  },
  logger:{
    level: 'verbose'
  }
}