import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrivacyAndTermsPage } from './privacy-and-terms.page';

describe('PrivacyAndTermsPage', () => {
  let component: PrivacyAndTermsPage;
  let fixture: ComponentFixture<PrivacyAndTermsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyAndTermsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyAndTermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
