import hashlib
import json
from time import time


class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions = []

        # Create genesis block
        self.create_block(previous_hash="1")

    # ----------------------------
    # BLOCK CREATION (unchanged core idea)
    # ----------------------------
    def create_block(self, previous_hash=None):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions.copy(),
            'previous_hash': previous_hash or (self.hash(self.chain[-1]) if self.chain else "1"),
        }

        self.current_transactions = []
        self.chain.append(block)
        return block

    # ----------------------------
    # ESCROW TRANSACTIONS (NEW CORE LOGIC)
    # ----------------------------
    def create_escrow(self, sender, recipient, amount, from_currency, to_currency, exchange_rate):
        escrow = {
            'type': 'escrow',
            'status': 'locked',  # locked → released → refunded
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'from_currency': from_currency,
            'to_currency': to_currency,
            'exchange_rate': exchange_rate,
            'timestamp': time()
        }

        self.current_transactions.append(escrow)
        return self.last_block['index'] + 1

    def release_escrow(self, escrow_id):
        for block in self.chain:
            for tx in block['transactions']:
                if tx.get('type') == 'escrow' and tx.get('status') == 'locked':
                    tx['status'] = 'released'
                    tx['released_at'] = time()
                    return True
        return False

    def refund_escrow(self, escrow_id):
        for block in self.chain:
            for tx in block['transactions']:
                if tx.get('type') == 'escrow' and tx.get('status') == 'locked':
                    tx['status'] = 'refunded'
                    tx['refunded_at'] = time()
                    return True
        return False

    # ----------------------------
    # HASHING (unchanged)
    # ----------------------------
    @staticmethod
    def hash(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        return self.chain[-1]

    # ----------------------------
    # CHAIN VALIDATION (simplified, no mining anymore)
    # ----------------------------
    def is_chain_valid(self, chain):
        for i in range(1, len(chain)):
            prev = chain[i - 1]
            curr = chain[i]

            if curr['previous_hash'] != self.hash(prev):
                return False

        return True

    # ----------------------------
    # VIEW CHAIN
    # ----------------------------
    def get_chain(self):
        return self.chain