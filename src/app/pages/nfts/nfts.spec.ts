import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nfts } from './nfts';

describe('Nfts', () => {
  let component: Nfts;
  let fixture: ComponentFixture<Nfts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nfts],
    }).compileComponents();

    fixture = TestBed.createComponent(Nfts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
