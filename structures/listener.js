module.exports = class EventListener {
  
  constructor(client) {
    this.client = client;

    let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.filter(m => m.startsWith('on')).forEach(m => {
      this.client.on(m.replace('on', '').uncapitalize(), this[m])
    });
  }

}