from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route('/add_book', methods=['POST'])
def add_book():
    return 'Done', 201

@main.route('/books')
def books():
    books = []
    return jsonify({'books':books})