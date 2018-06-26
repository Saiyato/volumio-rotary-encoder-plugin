const EventEmitter = require('events').EventEmitter;
const Gpio = require('onoff').Gpio;
const rotaryLogic = Object.freeze({"DEFAULT":0, "4xSPEED":1 });

/**
 * Creates a new Rotary Encoder using three GPIO pins
 * Expects the pins to be configured as pull-up
 *
 * @param pin_CLK GPIO # of the first pin
 * @param pin_DT GPIO # of the second pin
 * @param pin_SW GPIO # of the third pin
 * @param encoderType determines the speed (1 or every 4 detents)
 *
 * @returns EventEmitter
 */
function RotaryEncoder(pin_CLK, pin_DT, pin_SW, encoderType) {
	this.CLK = new Gpio(pin_CLK, 'in', 'both');
	this.DT = new Gpio(pin_DT, 'in', 'both');
	this.SW = new Gpio(pin_SW, 'in', 'both');

	this.sw_value = 0;
	this.rot_value = 0;
	this.clk_value = 1;
	this.dt_value = 1;
	this.last_encoded = 0b0011;
	if (encoderType == rotaryLogic.DEFAULT) {this.encStep=4} else {this.encStep=1};

	this.CLK.watch((err, value) => {
		if (err) {
			this.emit('error', err);
			return;
		}
		this.clk_value = value;    
		this.Tick();
	});

	this.DT.watch((err, value) => {
		if (err) {
			this.emit('error', err);
			return;
		}
		this.dt_value = value;    
		this.Tick();
	});
	
	this.SW.watch((err, value) => {
		if (err) {
			this.emit('error', err);
			return;
		}
		this.sw_value = value;
		this.click();
	});	
}

RotaryEncoder.prototype = EventEmitter.prototype;

RotaryEncoder.prototype.Tick = function Tick()
{
	/* 
		Gray code 
		[
			00,
			01,
			11,
			10
		]
	*/
	const { clk_value, dt_value } = this;
	const MSB = clk_value;
	const LSB = dt_value;

	const encoded = (MSB << 1) | LSB;
	const sum = (this.last_encoded << 2) | encoded;

	if (sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) {
		// CW
		this.rot_value++;
		if (this.rot_value >= this.encStep) {this.rot_value=0; this.emit('rotation', 1);}
	}
	if (sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) {
		// CCW
		this.rot_value--;
		if (this.rot_value <= -this.encStep) {this.rot_value=0; this.emit('rotation', -1);}
	}
	if (clk_value && dt_value) this.rot_value=0;   //locking position
	this.last_encoded = encoded;
	return this;
}

RotaryEncoder.prototype.destroy = function destroy()
{
	try
	{		
		this.CLK.unwatchAll();
		this.CLK.unexport();
		this.DT.unwatchAll();
		this.DT.unexport();
		this.SW.unwatchAll();
		this.SW.unexport();
	}
	catch(ex)
	{
		console.log('Could not destroy object; ' + ex);
	}
}

RotaryEncoder.prototype.click = function click() {
	// 0 = down, 1 = up
	const { sw_value } = this;
	
	// CLICK
	this.emit('click', sw_value);	
	return this;
};

module.exports = function rotaryEncoder(pin_CLK, pin_DT, pin_SW, encoderType) {
	return new RotaryEncoder(pin_CLK, pin_DT, pin_SW, encoderType);
};