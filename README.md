# **Weather forecasting**
A frontend assignment for NAB written in ReactJS.

# Deployment link
https://htmlpreview.github.io/?https://github.com/khanh-shady/NAB/blob/master/dist/index.html

# Introductory
This is written purely in ReactJS, for state management I use a simple method that utilizes React hooks (a simplified version of my own library forked from https://github.com/andregardi/use-global-hook).

Due to the time constraint, for deployment I decided to commit the production build to be able to use https://htmlpreview.github.io/ and used a Firebase function to proxy client requests to https://www.metaweather.com/api/. 

# 1. Run development server
```javascript
npm start
```
It will run on http://localhost:9000

# 2. Run tests
```javascript
npm test
```