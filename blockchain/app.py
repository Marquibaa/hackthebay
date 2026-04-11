from flask import Flask, jsonify, request
from blockchain import Blockchain

app = Flask(__name__)

blockchain = Blockchain()


@app.route('/')
def home():
    return "Escrow Blockchain API is running"


# ---------------------------
# CREATE ESCROW
# ---------------------------
@app.route('/escrow/create', methods=['POST'])
def create_escrow():
    data = request.get_json()

    index = blockchain.create_escrow(
        sender=data['sender'],
        recipient=data['recipient'],
        amount=data['amount'],
        from_currency=data['from_currency'],
        to_currency=data['to_currency'],
        exchange_rate=data['exchange_rate']
    )

    return jsonify({
        "message": f"Escrow transaction will be added to Block {index}"
    }), 201


# ---------------------------
# RELEASE ESCROW
# ---------------------------
@app.route('/escrow/release', methods=['POST'])
def release_escrow():
    data = request.get_json()

    result = blockchain.release_escrow(data['escrow_id'])

    return jsonify({
        "success": result
    }), 200


# ---------------------------
# REFUND ESCROW
# ---------------------------
@app.route('/escrow/refund', methods=['POST'])
def refund_escrow():
    data = request.get_json()

    result = blockchain.refund_escrow(data['escrow_id'])

    return jsonify({
        "success": result
    }), 200


# ---------------------------
# VIEW CHAIN
# ---------------------------
@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.get_chain(),
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True)