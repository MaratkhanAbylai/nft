import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNfts } from './my-nfts';

describe('MyNfts', () => {
  let component: MyNfts;
  let fixture: ComponentFixture<MyNfts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNfts],
    }).compileComponents();

    fixture = TestBed.createComponent(MyNfts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
