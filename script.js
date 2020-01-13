// Interview Test Program
// LRU Cache implementation, Javascript
// For production, just use https://www.npmjs.com/package/lru-cache :)


class Node {
  constructor(key, value, next = null, prev = null) {
    this.key = key;
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class LRUCache {
  // Default size 42, because it's the answer to everything. 
  constructor(limit = 42) {
    this.size = 0;
    this.limit = limit;
    this.head = null;
    this.tail = null;
    this.cache = {};
  }

  // Put new key value pair into the cache
  put(key, value){
    this.ensureLimit(); // Delete from cache if we need to make space for this entry

    if(!this.head){
      this.head = this.tail = new Node(key, value);
    }else{
      const node = new Node(key, value, this.head);
      this.head.prev = node;
      this.head = node;
    }

    // Update the cache map
    this.cache[key] = this.head;
    this.size++;
  }

  // Get a value, and remember to make it the most recently (head) used in the cache
  get(key){
    if(this.cache[key]){
      const value = this.cache[key].value;
      // Remove the entry, since we just used it... 
      this.del(key)
      // Pop it back at the top, since it's now most recently used.
      this.put(key, value);
      return value;
    } else {
      return undefined; // No entry in the cache for this key
    }
  }

  ensureLimit(){
    if(this.size === this.limit){
      // We are at limit, delete the least recently used entry (the tail)
      this.del(this.tail.key)
    }
  }

  del(key){
    const node = this.cache[key];
    try {
    // Move head ref if needed
      if(node.prev !== null){
        node.prev.next = node.next;
      }else{
       this.head = node.next;
      }

      // Move tail ref if needed
      if(node.next !== null){
        node.next.prev = node.prev;
      }else{
        this.tail = node.prev
      }

      delete this.cache[key];
      this.size--;
    } catch (err) {
      // Failed - return no-op
      return false;
    }
  }

  // Clear cache
  reset() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.cache = {};
  }

  // Iterates over all the the cache, in order of most recent first.
  forEach(fn) {
    let node = this.head;
    let counter = 0;
    while (node) {
      fn(node, counter);
      node = node.next;
      counter++;
    }
  }

  // Interate thru cache
  *[Symbol.iterator]() {
    let node = this.head;
    while (node) {
      yield node;
      node = node.next;
    }
  }
}

console.log("LRUCache Testing\n\n");
// 1. Init, max size 4
let lruCache = new LRUCache(4);

console.log('1. Initialized LRUCache with size of ' + lruCache.limit + ', Currently has ' + lruCache.size + ' entries');

// 2. Put entries into the cache
lruCache.put('key1', '2020-01-13');
lruCache.put('key2', '2019-12-12');
lruCache.put('key3', '2020-01-09');
console.log('2. Added 3 entries, size is now ' + lruCache.size);

// 3. get the value of a key
console.log('3. Direct get of key1=' + lruCache.get('key1'));

lruCache.put('key4', '2020-01-14');
console.log('   Direct get of newly added element=' + lruCache.get('key4'));

lruCache.put('key5', '2020-01-14');
lruCache.put('key6', '2020-01-14');
console.log('3. Added 2 more entries, size should still be 4 and currently is ' + lruCache.size); 

// We sized with 4, but have added 6 entries, so 2 of them should no longer be available (expired from cache)


// 4.  Delete Key
lruCache.del('key4');

if(!lruCache.del('key4')) { 
  console.log('4. Delete returned no-op, which was expected');
}
// 5. Reset/clear the cache

lruCache.reset();
//  Prove it's empty...
console.log('5. Cache reset, reading key1 shall return undefined: ' + lruCache.get('key1'));





