import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNft } from './create-nft';

describe('CreateNft', () => {
  let component: CreateNft;
  let fixture: ComponentFixture<CreateNft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNft],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
