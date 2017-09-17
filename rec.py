from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import Imputer
import numpy as np
import sys


## Independent variables (Attributes):
# 1 checkins
# 2 description
# 3 engagement
# 4 overall_star_rating
# 5 price_range
# 6 rating_count

## Dependent variable (y value):
# 0 for not selected
# 1 for selected


## sentiment analysis on the training data descriptions

## add static dict for list of destinations (i.e. test_x values)

## parses training data
def parse_train():
    depvar = sys.argv[1]
    indepvar = sys.argv[2]
    X = np.genfromtxt(indepvar, delimiter=',', dtype=None)
    y = np.genfromtxt(depvar)
    return X,y


## parses testing data
def parse_test():
    indepvar = sys.argv[3]
    X = np.genfromtxt(indepvar, delimiter=',')
    return X

## builds model from training data
def rank_train(X, y):
    imputer = Imputer(missing_values = -900, strategy = "median", axis = 0)
    X = imputer.fit_transform(X)
    print(X)
    clf = RandomForestClassifier(max_depth=2, random_state=0)
    clf.fit(X, y)
    RandomForestClassifier(bootstrap=True, class_weight=None, criterion='gini',
            max_depth=2, max_features='sqrt', max_leaf_nodes=None,
            min_impurity_split=None,
            min_samples_leaf=1, min_samples_split=2,
            min_weight_fraction_leaf=0.0, n_estimators=20, n_jobs=1,
            oob_score=False, random_state=0, verbose=0, warm_start=False)

    return clf

## returns predicted class probabilities of testing data
def rank_pred(X, clf):
    return clf.predict_proba(X)


## main routine
if __name__ == '__main__':
    X, y = parse_train()
    clf = rank_train(X,y)
    test = parse_test()
    pred = rank_pred(test,clf)
    print(pred)