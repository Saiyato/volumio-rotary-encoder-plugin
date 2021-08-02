# volumio-rotary-encoder-plugin
Volumio 2 plugin to configure two simple rotary encoders.

## Some notes
1. A lot of HATs use GPIO 17, don't use it for the encoder when this is the case!
2. The click requires pullup for that specific GPIO pin, the encoder will just compare the previous values and shouldn't require pullup or -down

## Quick start
1. Connect your rotary encoder(s) and write down the pins you have used

* CLK = pin A
* DT = pin B

![Alt text](/images/rotary_encoder.jpg?raw=true "Rotary encoder")

The rest of the pins is self explanatory.

2. Install the plugin
3. Configure your encoder(s) using the pins you wrote down.
   * Configure CLK to 0 (zero) to disable the encoder
   * Configure SW to 0 (zero) to disable the (push) button on the encoder
4. Choose your logic (default (gray coding) or 4x speed, which decreases sensitivity by 25%)

![Alt text](/images/rotary_logic.png?raw=true "Rotary encoder")

Source: http://www.stuffaboutcode.com/2015/05/raspberry-pi-and-ky040-rotary-encoder.html

## Troubleshooting
Should you encounter any problems with the encoder try the following:

1. Add HW (hardware) debouncing; I've ordered 0.1uF capacitors to place between *CLK and GND* and/or *DT and GND*
2. Try other rotary logic; I've tried to minimize the amount of double reads for my KY040 encoder, now the default *gray coding* should work, otherwise try the 4x speed setting.

I'd advise to use HW debouncing as most people seem to have solved their problems using that solution.

## So what pins did I use with my Hifiberry AMP?
GPIO15 -> CLK
GPIO17 -> DT
GPIO4 -> SW

I also decreased the volume steps to 5. Go to Settings > Playback options > Volume options and set 'one click volume steps' to 5. Because the plugin uses the volumio controls (which are async), you might feel that it's not as snappy as you want it to be. If I have the time, I might look into this, but for now at least it works, eh ;)