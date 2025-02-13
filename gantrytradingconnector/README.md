# GantryTradingConnector

# General Description: 

This application get the trading data(Sports,Regions,Competions,Fixtures,Markets .. ETC) from TCA API services which are mentioned below. In between we have some business logic to filter/convert that content which is relevant for DisplayManager(https://cms-thunderbolt.prod.env.works/sitecore/shell/client/Applications/DisplayManager/) and show it to user on DisplayManager.

API which we are using currently:
http://tca.prod.env.works/api/masterdata/Sports

http://tca.prod.env.works/api/masterdata/Regions

http://tca.prod.env.works/api/masterdata/Competions

http://tca.prod.env.works/api/search

http://tca.prod.env.works/api/betcontent/FixtureV9/

http://tradingapi.prod.env.works/betcontent/v1/OptionMarketSlims

In above API's we are passing different params to get what we need. Swagger:  https://gantrytradingconnector.prod.env.works/index.html

Regarding the support: we have general ROTA where we have L1, L2, L3 support. For application issues, it goes through GCC.
https://coralracing.sharepoint.com/:x:/r/sites/CMS-Display-DisplayTeam/Shared%20Documents/DisplayTeam/L3-ROTA.xlsx?d=w5fd0f685935844a58f15d85bdc281510&csf=1&web=1&e=HhW43y
