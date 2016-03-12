PLUGIN_FILES=plugin/manifest.json\
			 plugin/bg.js\
			 plugin/scenerize.js\
			 plugin/locscrape.js\
			 plugin/googscrape.js\
			 plugin/start.png\
			 plugin/complete.png

all: plugin.zip

clean:
	rm plugin.zip

plugin.zip: $(PLUGIN_FILES)
	zip plugin.zip $(PLUGIN_FILES)
