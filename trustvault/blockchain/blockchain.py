import hashlib
import json
from time import time


class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        self.difficulty = 4

        # Create the genesis block
        self.create_block(proof=100, previous_hash='1')

    def create_block(self, proof, previous_hash=None):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions.copy(),
            'proof': proof,
            'previous_hash': previous_hash or (self.hash(self.chain[-1]) if self.chain else '1'),
        }

        self.current_transactions = []
        self.chain.append(block)
        return block

    def add_transaction(self, sender, recipient, amount):
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })

        return self.last_block['index'] + 1

    @staticmethod
    def hash(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        return self.chain[-1]

    def proof_of_work(self, last_proof):
        proof = 0
        while not self.valid_proof(last_proof, proof):
            proof += 1
        return proof

    def valid_proof(self, last_proof, proof):
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:self.difficulty] == "0" * self.difficulty

    def is_chain_valid(self, chain):
        for i in range(1, len(chain)):
            prev = chain[i - 1]
            curr = chain[i]

            # Check that the hash of the block is correct
            if curr['previous_hash'] != self.hash(prev):
                return False

            # Check that the Proof of Work is correct
            if not self.valid_proof(prev['proof'], curr['proof']):
                return False

        return True

    def mine_block(self, miner_address):
        # Reward for mining
        self.add_transaction(sender="0", recipient=miner_address, amount=1)

        last_proof = self.last_block['proof']
        proof = self.proof_of_work(last_proof)

        return self.create_block(proof)

    def get_chain(self):
        return self.chain