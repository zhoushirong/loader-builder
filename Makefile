TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/mocha/bin/mocha
MOCHA_ = ./node_modules/mocha/bin/_mocha
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

lint:
	@eslint --fix lib bin/builder test/*.js

test:
	@NODE_ENV=test $(MOCHA) -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@$(ISTANBUL) cover --report html $(MOCHA_) -- -t $(TIMEOUT) -R spec $(TESTS)

test-coveralls:
	@$(ISTANBUL) cover --report lcovonly $(MOCHA_) -- -t $(TIMEOUT) -R spec $(TESTS)
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@cat ./coverage/lcov.info | $(COVERALLS) && rm -rf ./coverage

test-all: test test-coveralls

clean:
	@rm ./test/assets/*.min.*
	@rm ./test/assets/*.debug.*

.PHONY: test
