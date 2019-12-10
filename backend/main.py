import flask
import pandas as pd
from flask import Blueprint, jsonify
from scipy.sparse.linalg import svds
import numpy as np

app = flask.Flask('__main__')
@app.route('/')
def my_index():
    return flask.render_template('index.html', token = 'Hello Flask + React')

# add a book
@app.route('/add_book', methods=['POST'])
def add_book():
    return 'Done', 201


# add a rating
@app.route('/add_rating/<user_id>/<book_id>/<rating>', methods=['POST'])
def add_book(user_id, book_id, rating):
    user_rating = pd.DataFrame({'user_id':[user_id], 'book_id':[book_id], 'rating':[rating]})
    user_rating.to_csv('./Dataset/ratings.csv',mode='a', header=False, index=None)
    return 'Done', 201


# get list of books that user has rated
@app.route('/add_rating/<user_id>')
def add_book(user_id):
    ratings_data = pd.read_csv("./Dataset/ratings.csv")
    user_ratings = ratings_data['user_id'] == user_id

    return jsonify({'books':user_ratings.head(10).to_dict(orient='records')})



# get all top rated books
@app.route('/books')
def books():
    books_data = pd.read_csv("./Dataset/books.csv")
    return jsonify({'books':books_data.head(10).to_dict(orient='records')})


# get recommended books by user id
@app.route('/recommendations/<user_id>')
def get_recommendations(user_id):
    print(user_id)
    books_data = pd.read_csv("./Dataset/books.csv")
    ratings_data = pd.read_csv("./Dataset/ratings.csv")

    global_ratings_df = ratings_data.pivot(index="user_id", columns="book_id", values="rating").fillna(0)
    
    global_ratings_matrix = global_ratings_df.as_matrix()
    user_ratings_mean = np.mean(global_ratings_matrix, axis = 1)
    global_ratings_demeaned = global_ratings_matrix - user_ratings_mean.reshape(-1, 1)

    U, sigma, Vt = svds(global_ratings_demeaned, k = 50)
    sigma = np.diag(sigma)

    all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
    prediction_df = pd.DataFrame(all_user_predicted_ratings, columns = global_ratings_df.columns)
                                            
    already_rated, predictions = recommend_books(prediction_df, 10, books_data, ratings_data, 10)

    return jsonify({'books':predictions.head(10).to_dict(orient='records')})

def recommend_books(predictions_data, user_id, book_data, original_ratings_data, num_recommendations = 5):
    # Get and sort the user's predictions
    user_row_number = user_id - 1 # user_id starts at 1, not 0
    sorted_user_pred  = predictions_data.iloc[user_row_number].sort_values(ascending=False)
    
    # Get the user's data and merge in the movie information
    user_data = original_ratings_data[original_ratings_data.user_id == (user_id)]
    user = (user_data.merge(book_data, how = 'left', left_on="book_id", right_on = "book_id").sort_values(['rating'], ascending=False))
    
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


