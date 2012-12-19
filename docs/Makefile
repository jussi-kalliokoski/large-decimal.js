SOURCES ?= ../src/core.js ../src/algebra.js
DOCS_TEMPLATE ?= template.html
DOCS ?= DOCS.html

all: $(DOCS)

$(DOCS): $(SOURCES) $(DOCS_TEMPLATE)
	cat $(SOURCES) | doctor.js -d | docgenerator.js $(DOCS_TEMPLATE) > $@

clean:
	rm -rf $(DOCS)

.PHONY: all clean
