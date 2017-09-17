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
dest = [["Santorini", 36.4071333,25.3504189, "http://i.huffpost.com/gen/2735140/images/o-GREECE-facebook.jpg"],
        ["Rome", 41.9099856,12.39557, "https://brightcove04pmdo-a.akamaihd.net/5104226627001/5104226627001_5232386545001_5215063851001-vs.jpg?pubId=5104226627001&videoId=5215063851001"],
        ["Ibiza", 38.9742588,1.2769595, "https://content4travel.com/cms/img/u/kraj/1/ibiza_4.jpg?version=2"],
        ["Lisbon", 38.7436056,-9.2304151, "http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/Portugal/Lisbon/Lisbon---36-Hours---Rossio-Square-night-xlarge.jpg"],
        ['Paris', 48.8588376,2.2768484, "http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/France/Paris/paris-attractions-xlarge.jpg"],
        ["Amsterdam", 52.3746325,4.7581968, "https://lonelyplanetimages.imgix.net/mastheads/stock-photo-beautiful-amsterdam-76796579.jpg?sharp=10&vib=20&w=1200"],
        ["Hong Kong", 22.3524918,113.8468169, "http://www.hkexpress.com/sites/default/files/hong-kong%20bg%20image_2.jpg"],
        ["Tokyo", 35.6732615,139.5699592, "http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/tokyo-mud-bath-bar-mudbath0716.jpg?itok=dJ8lDXJh"],
        ["Honolulu", 21.3279755,-157.9395033, "https://cdn.thecrazytourist.com/wp-content/uploads/2016/06/Waikiki-Beach-Honolulu-1024x683.jpg"],
        ["Maui", 20.8027672,-156.6188664, "http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/maui-facebook-maui-mu1115.jpg?itok=_lxNn8tG"],
        ["Laguna Beach", 33.5472159,-117.8459009, "https://www.californiabeaches.com/wp-content/uploads/2014/09/laguna-beach2-e1466198100739.jpg"],
        ["Las Vegas", 36.1249181,-115.3154287, "http://svcdn.simpleviewinc.com/v3/cache/lasvegas/14679F47EC9B965E4A510BFB528895CE.jpg"],
        ["New York", 40.6971477,-74.2605552, "https://www.gentlegiant.com/wp-content/uploads/2015/06/New-York.jpg"],
        ["Toronto", 43.6565336,-79.6017223, "https://web.toronto.ca/wp-content/uploads/2017/07/9163-invest-in-toronto-995x330.png"],
        ["Sydney", -33.8479255,150.6510967, "https://lonelyplanetimages.imgix.net/mastheads/65830387.jpg?sharp=10&vib=20&w=1200"],
        ["Miami", 25.7823907,-80.2996707, "http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/1446151328/miami-header-dg1015.jpg?itok=eIwFd7q_"]]

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