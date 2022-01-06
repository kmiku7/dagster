dev_webapp:
	REACT_APP_BACKEND_ORIGIN="http://localhost:3333" yarn start

generate-graphql:
	yarn workspace @dagit/core generate-graphql

ts:
	yarn workspace @dagit/app ts && yarn workspace @dagit/core ts && yarn workspace @dagit/ui ts

lint:
	yarn workspace @dagit/app lint && yarn workspace @dagit/core lint && yarn workspace @dagit/ui lint

test:
	yarn workspace @dagit/core jest && yarn workspace @dagit/ui jest

jest:
	yarn workspace @dagit/core jest && yarn workspace @dagit/ui jest
