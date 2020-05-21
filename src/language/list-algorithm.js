class _Node {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertBefore(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = new _Node(item, currNode);
  }

  insertAfter(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && previousNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = new _Node(item, currNode);
  }

  insertAtIncorrect(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head; // 2
    let previousNode = this.head; // 2

    for (let i = 1; i < parseInt(key); i++) {
      previousNode = currNode; // 3
      currNode = currNode.next; // 4
    }

    let newNode = new _Node(item, currNode.next)
    newNode.value.next = currNode.next.value.id
    previousNode.next = newNode;
    previousNode.value.next = newNode.value.id
  }

  insertAtCorrect(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head; // 2
    let previousNode = this.head; // 2

    for (let i = 1; i < parseInt(key); i++) {
      previousNode = currNode; // 3
      currNode = currNode.next; // 4
    }

    let newNode = new _Node(item, currNode.next)
    newNode.value.next = currNode.next.value.id
    previousNode.next.next = newNode;
    previousNode.next.value.next = newNode.value.id
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      // eslint-disable-next-line no-console
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
}

module.exports = LinkedList;