import { TestBed } from '@angular/core/testing';

import { MoveTodoListsService } from './move-todo-lists.service';

describe('MoveTodoListsService', () => {
  let service: MoveTodoListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveTodoListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
