import {
    async,
    ComponentFixture,
    TestBed,
    waitForAsync,
} from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
    /* setando um componente exlcusivo para teste */
    let component: CoursesCardListComponent;
    //fixture type tem funções de utilidade para analise
    let fixture: ComponentFixture<CoursesCardListComponent>;

    let el: DebugElement;

    //wait for async da 5 segundos para cada linha q tenha operações assincronas
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            /* precisa ter todos os imports usados no componente para ele ser testado */
            imports: [CoursesModule],
        });

        /* criando|compilando o componente em questão | necessario esperar a promisse */
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CoursesCardListComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
        });
    }));

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should display the course list", () => {
        /* atribiu a lista de cursos para o componente */
        component.courses = setupCourses();
        //como alterou o componente vc precisa atualizar a DOM para as mundaças
        //serem notadas
        fixture.detectChanges();

        const cards = el.queryAll(By.css(".course-card"));

        expect(cards).toBeTruthy("could not find cards");
        expect(cards.length).toEqual(12);
    });

    it("should display the first course", () => {
        component.courses = setupCourses();
        fixture.detectChanges();

        const course = component.courses[0];
        const card = el.query(By.css(".course-card:first-child"));
        const title = card.query(By.css("mat-card-title"));
        const img = card.query(By.css("img"));

        expect(card).toBeTruthy("Could not find course card");
        expect(title.nativeElement.textContent).toBe(course.titles.description);
        expect(img.nativeElement.src).toBe(course.iconUrl);
    });
});
