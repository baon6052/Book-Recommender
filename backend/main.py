import flask
import pandas as pd
from flask import Blueprint, jsonify
from scipy.sparse.linalg import svds
import numpy as np
from flask import request

import json

app = flask.Flask('__main__')
@app.route('/')
def my_index():
    return flask.render_template('index.html', token = 'Hello Flask + React')


# login
@app.route('/login')
def login():
    username = request.args.get('username')

    print(username)
    username_data = pd.read_csv("./Dataset/username.csv")
    if len(username_data.loc[username_data['username'] == username]) == 1:
        user_id = username_data.loc[username_data['username'] == username]
        user_id = user_id['user_id'].values[0]
        return jsonify({'user_id':int(user_id)})

    return jsonify('Username Not Found'), 404

# register
@app.route('/register', methods=['POST'])
def register():
    username = request.get_json()['username']
    username_data = pd.read_csv("./Dataset/username.csv")
    if len(username_data.loc[username_data['username'] == str(username)]) == 1:
        return 'Username Exists', 403
    
    new_user_id = username_data['user_id'].max() + 1
    new_user = pd.DataFrame({'username':[str(username)],'user_id':[int(new_user_id)]})
    new_user.to_csv('./Dataset/username.csv',mode='a', header=False, index=None)

    return jsonify({'user_id':str(new_user_id)})


# login
@app.route('/search')
def search():
    search_input = request.args.get('search_input')

    print(search_input)
    book_data = pd.read_csv("./Dataset/books.csv")
    #print([col for col in book_data])
    #mask = np.column_stack([book_data[col].str.contains("(?i)" + str(search_input), na=False) for col in ['original_title', 'authors', 'genre'] ])
    # print(mask.any() == True)
    #book_data = book_data.loc[mask.any(axis=1)]
    book_data = book_data.dropna()
    title = book_data[book_data['original_title'].str.contains("(?i)" + str(search_input))]
    author = book_data[book_data['authors'].str.contains("(?i)" + str(search_input))]
    book_data = title.append(author)
    book_data = book_data.drop_duplicates()

    return jsonify({'books':book_data.head(60).to_dict(orient='records')})

# add a book
@app.route('/add_book', methods=['POST'])
def add_book():
    return 'Done', 201


# add a rating
@app.route('/add_rating', methods=['POST'])
def add_rating():

    user_id = request.get_json()['user_id']
    book_id = request.get_json()['book_id']
    rating = request.get_json()['rating']

    ratings_data = pd.read_csv("./Dataset/ratings.csv")

    # if previously rated
    if len(ratings_data.loc[(ratings_data["user_id"] == int(user_id)) & (ratings_data["book_id"] == int(book_id)), "rating"]) > 0:
        # select the row and update the rating
        ratings_data.loc[(ratings_data["user_id"] == int(user_id)) & (ratings_data["book_id"] == int(book_id)), "rating"] = rating
        ratings_data.to_csv('./Dataset/ratings.csv', index=None)
    else:
        # add new rating for the book
        user_rating = pd.DataFrame({'user_id':[user_id], 'book_id':[book_id], 'rating':[rating]})
        user_rating.to_csv('./Dataset/ratings.csv',mode='a', header=False, index=None)
    
    
    return 'Done', 201


# # get list of books that user has rated
# @app.route('/add_rating/<user_id>')
# def get_rated_books(user_id):
 
#     ratings_data = pd.read_csv("./Dataset/ratings.csv")
#     user_ratings = ratings_data.loc[ratings_data['user_id']== user_id]

#     return jsonify({'books':user_ratings.head(15).to_dict(orient='records')})


# get all books that user has rated only
@app.route('/get_rated')
def geRratedBooks():
    user_id = request.args.get('user_id')

    books_data = pd.read_csv("./Dataset/books.csv")
    ratings_data = pd.read_csv("./Dataset/ratings.csv")

    user_data = ratings_data.loc[ratings_data['user_id']== int(user_id)]
    books_data = books_data.merge(user_data, how='left', on='book_id')
    books_data = books_data.drop('user_id', 1)

    books_data = books_data.dropna()
    #print(books_data.head(10).to_dict(orient='records'))
    return jsonify({'books':books_data.head(60).to_dict(orient='records')})


# get all top rated books and attach user score to them
@app.route('/books')
def books(): 

    user_id = request.args.get('user_id')

    books_data = pd.read_csv("./Dataset/books.csv")
    ratings_data = pd.read_csv("./Dataset/ratings.csv")

    user_data = ratings_data.loc[ratings_data['user_id']== int(user_id)]
    books_data = books_data.merge(user_data, how='left', on='book_id')
    books_data = books_data.drop('user_id', 1)

    books_data = books_data.fillna(0)
    #print(books_data.head(10).to_dict(orient='records'))
    return jsonify({'books':books_data.head(60).to_dict(orient='records')})


# get recommended books by user id
@app.route('/recommendations')
def get_recommendations():
    user_id = request.args.get('user_id')


    user_id = int(user_id)
    books_data = pd.read_csv("./Dataset/books.csv")
    ratings_data = pd.read_csv("./Dataset/ratings.csv")

    # check if they have made any ratings
    # if they have then procceed as normal
    # otherwise assign user_id to the global user (which rates the most common books as five stars)

    if len(ratings_data[ratings_data['user_id'] == int(user_id)]) == 0:
        user_id = 100000


    global_ratings_df = ratings_data.pivot(index="user_id", columns="book_id", values="rating").fillna(0)
    
    global_ratings_matrix = global_ratings_df.as_matrix()
    user_ratings_mean = np.mean(global_ratings_matrix, axis = 1)
    global_ratings_demeaned = global_ratings_matrix - user_ratings_mean.reshape(-1, 1)

    U, sigma, Vt = svds(global_ratings_demeaned, k = 50)
    sigma = np.diag(sigma)

    all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
    prediction_df = pd.DataFrame(all_user_predicted_ratings, columns = global_ratings_df.columns)
    
    prediction_df['user_id'] = global_ratings_df.index.values  
  
    already_rated, predictions = recommend_books(prediction_df, user_id, books_data, ratings_data, 10)
    predictions = predictions.dropna()
    return jsonify({'books':predictions.head(12).to_dict(orient='records')})

def recommend_books(predictions_data, user_id, book_data, original_ratings_data, num_recommendations = 5):
    # Get and sort the user's predictions

    sorted_user_pred  = predictions_data.loc[predictions_data['user_id'] == user_id]
    sorted_user_pred = sorted_user_pred.drop(['user_id'], axis = 1)
    user_row_number  = sorted_user_pred.index[0]
    sorted_user_pred = predictions_data.iloc[sorted_user_pred.index[0]].sort_values(ascending=False)
  

    # Get the user's data and merge in the movie information
    user_data = original_ratings_data[original_ratings_data.user_id == (user_id)]
    user = user_data.merge(book_data, how = 'left', left_on="book_id", right_on = "book_id").sort_values(['rating'], ascending=False)
    #
    print('User {0} has already rated {1} books.'.format(user_id, user.shape[0]))
    print('Recommending the highest {0} predicted ratings books not already rated.'.format(num_recommendations))
    

    # Recommend the highest predicted rating movies that the user hasn't seen yet.
    recommendations = (book_data[~book_data['book_id'].isin(user['book_id'])].
                      merge(pd.DataFrame(sorted_user_pred).reset_index(), how="left",
                           left_on = 'book_id',
                           right_on = 'book_id').
                      rename(columns = {user_row_number: 'Predictions'}).
                      sort_values('Predictions', ascending = False).
                      iloc[:num_recommendations, :-1])
    
    return user, recommendations


app.run(debug = True)


