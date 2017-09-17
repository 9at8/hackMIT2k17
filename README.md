# Hack Mi Travel

### Inspiration
We were motivated by the lack of personalization in ad campaigns and newsletters by companies like Expedia and Kayak. Therefore we decided to create a different traveling experience where users get more customized flight deals and trip recommendations.

### What it does
Upon entering the site, the user will first select from a list of nearby attractions that he/she has either visited or want to visit. Then our app will return a list of ranked trip recommendations based on the user's previous response.

### How we built it
The front-end is built using React, which runs on a node.js server. The customized recommendation and ranking is done in the python and node scripts that implement random forest and sentiment analysis algorithms. For more details on the algorithms used, visit our github page.

### Technical notes
When we first came across the problem, we considered various algorithms and mathematical tools for building ranking systems. Due to time limitations, training a neural network from scratch was an impractical approach. We decided to reduce the problem down to a classification problem - predicting the users' response (likelihood of traveling to a certain city) by learning from survey results (i.e. where the users have been to before).

This application uses the Random Forest Classification algorithm extensively. Random Forest is an improvement from the Decision Tree algorithm in that the models built are generally more robust and less prone to over-fitting. The source code of the Random Forest implementation that we chose can be found at [sklearn](http://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html). To perform imputation on dependent variables with missing values, we used the sklearn Imputer class with imputation strategy equal to the median.
Since this is a weekend-long project, we were unable to fully optimize all the parameters and hence we went with textbook-default values for key parameters such as number of features and depth of recursion. We also set the splitting criterion to Gini index instead of entropy in order to reduce computation overhead.

### What's next for us
We look forward to generalizing our algorithm to other recommendation problems such as hospitals, schools, shops, and etc. With more time and organic user growth, we would also love to improve the accuracy of our classifier.
