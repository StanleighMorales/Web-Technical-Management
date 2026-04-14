.PHONY: install run test status log push build deploy

# install all the dependencies
install:
	npm install

build:
	npm run build

# run the application
run:
	npm run dev

# run the unit test
test:
	npm run test

# show the git status
status:
	git status

# show the commit history
log:
	git log

# push your code
push:
	git push origin develop

# deploy the app to cloudflare pages
deploy:
	npx wrangler pages deploy ./dist
