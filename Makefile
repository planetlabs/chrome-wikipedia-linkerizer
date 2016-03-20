PLUGIN_FILES=plugin/manifest.json\
			 plugin/bg.js\
			 plugin/scenerize.js\
			 plugin/locscrape.js\
			 plugin/googscrape.js\
			 plugin/start.png\
			 plugin/complete.png\
			 plugin/options.js\
			 plugin/options.html\
			 plugin/optionspage.js

all: scenerizer.zip

clean:
	rm -f scenerizer.zip googles.tmp plugin/manifest.json

scenerizer.zip: $(PLUGIN_FILES)
	zip scenerizer.zip $(PLUGIN_FILES)

plugin/manifest.json:
	curl http://www.google.com/supported_domains | sed -e 's/.*/        "https:\/\/www&\/\*",/' -e '$$ s/,//' > googles.tmp
	sed -e '/__GOOGLES/ r googles.tmp' -e '/__GOOGLES/ d' <plugin/pre_manifest.json > plugin/manifest.json
