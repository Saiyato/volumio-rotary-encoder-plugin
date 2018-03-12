# Volumio installer (workaround for fixes not in the Volumio repo)
if [ ! -d /home/volumio/volumio-rotary-encoder-plugin ];
then
	mkdir /home/volumio/volumio-rotary-encoder-plugin
else
	rm -rf home/volumio/volumio-rotary-encoder-plugin
	mkdir /home/volumio/volumio-rotary-encoder-plugin
fi

echo "Cloning github repo... (this might take a while)"
git clone https://github.com/Saiyato/volumio-rotary-encoder-plugin /home/volumio/volumio-rotary-encoder-plugin

echo "Cleaning up the directory..."
cd /home/volumio/volumio-rotary-encoder-plugin
rm -rf .git
rm -rf images
rm .gitattributes
rm LICENSE
rm README.md
rm volumio_installer.sh
rm volumio-rotary-encoder-plugin.zip

echo "Installing plugin..."
volumio plugin install
echo "Done!"