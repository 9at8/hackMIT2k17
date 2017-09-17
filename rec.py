from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import Imputer
import numpy as np
import random
import sys
import csv


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

## add static dict for list of destinations (i.e. test_x values)
dest = [["Santorini", 36.4071333,25.3504189],
        ["Rome", 41.9099856,12.39557],
        ["Ibiza", 38.9742588,1.2769595],
        ["Lisbon", 38.7436056,-9.2304151],
        ['Paris', 48.8588376,2.2768484],
        ["Amsterdam", 52.3746325,4.7581968],
        ["Hong Kong", 22.3524918,113.8468169],
        ["Tokyo", 35.6732615,139.5699592],
        ["Honolulu", 21.3279755,-157.9395033],
        ["Maui", 20.8027672,-156.6188664],
        ["Laguna Beach", 33.5472159,-117.8459009],
        ["Las Vegas", 36.1249181,-115.3154287],
        ["New York", 40.6971477,-74.2605552],
        ["Toronto", 43.6565336,-79.6017223],
        ["Sydney", -33.8479255,150.6510967],
        ["Miami", 25.7823907,-80.2996707]]

## generate fake data for destinations (no need for this anymore)
# print(len(dest))
# csvfile = "dest.csv"
# f=open(csvfile,'wb') # opens file for writing (erases contents)
# writer = csv.writer(f, delimiter =',',quotechar =',',quoting=csv.QUOTE_MINIMAL)
# row = 1
# while row <= 16:
#     writer.writerow([random.uniform(200000,500000), random.uniform(1,10), random.uniform(30000, 100000), random.uniform(0, 50),
#                         random.uniform(1, 5), random.uniform(200, 1000)])
#     row += 1

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
    results = pred.tolist()
    return_prob = []
    return_to_server = []
    index = 0
    for i in results:
        return_prob.append([i[1], index])
        index += 1
    return_prob.sort(key=lambda x: x[0], reverse=True)
    for i in return_prob:
        return_to_server.append(dest[i[1]])
    print(return_to_server)