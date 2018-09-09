import { HotCache } from "../src/hot-cache";

interface User {
  name: string;
  age: number;
}

describe('HotCache', () => {
  const setup = () => {
    return {
      
    };
  };
  
  it.only('should get last state', (done) => {
    const cache = new HotCache<User>();
    
    cache.update('1', {name: 'hector'});
    cache.update('1', {age: 26});
    cache.get('1').subscribe({
      next(state) {
        expect(state).toEqual({
          name: 'hector',
          age: 26
        });
        done()
      }
    })
  });
});
