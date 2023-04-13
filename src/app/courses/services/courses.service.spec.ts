import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
    HttpTestingController,
    HttpClientTestingModule,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
    let coursesService: CoursesService;
    //teste http para não usar o server
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CoursesService],
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it("should receive all courses", () => {
        coursesService.findAllCourses().subscribe((courses) => {
            //toBeTruthy verifica se é null, undefined, etc..
            expect(courses).toBeTruthy("No courses returned");
            expect(courses.length).toBe(12, "Incorrect number of coureses");

            const course = courses.find((c) => c.id == 12);

            expect(course.titles.description).toBe("Angular Testing Course");
        });

        //expectOne -> testa se apenas 1 chamada com este url foi feita
        //caso positivo retorna o mock
        const req = httpTestingController.expectOne("/api/courses");

        //verifica se o metódo usado na request é GET
        expect(req.request.method).toEqual("GET");

        //devolve para o subscribe esse payload | dps executa os teste do subscribe
        req.flush({ payload: Object.values(COURSES) });
    });

    it("should find a course by id", () => {
        coursesService.findCourseById(12).subscribe((course) => {
            expect(course).toBeTruthy("No course found");
            expect(course.id).toBe(12, "Course id is not 12");
        });

        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12]);
    });

    it("should save a course", () => {
        const changes: Partial<Course> = {
            titles: { description: "Testing Course" },
        };
        coursesService.saveCourse(12, changes).subscribe((course) => {
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toEqual("PUT");
        //comparando o que está sendo enviado para o server é igual as mudanças feitas
        expect(req.request.body.titles.description).toEqual(
            changes.titles.description
        );

        req.flush({
            ...COURSES[12],
            ...changes,
        });
    });

    it("should give an error if save course fails", () => {
        const changes: Partial<Course> = {
            titles: { description: "Testing Course" },
        };
        coursesService.saveCourse(12, changes).subscribe(
            (course) => {
                fail("the save course operation should have failed");
            },
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toEqual("PUT");
        req.flush("Save course failed", {
            status: 500,
            statusText: "Internal Server Error",
        });
    });

    it("should return list os lessons of a course", () => {
        coursesService.findLessons(12).subscribe((lessons) => {
            expect(lessons).toBeTruthy("No lesson returned");
            expect(lessons.length).toBe(3, "Wrong pagination");
        });

        /* quando tiver multiplos parametros analisa a rota e eles separadamente
        ...expectOne('/api/lessons) daria erro pcausa dos parametros */
        const req = httpTestingController.expectOne(
            (req) => req.url == "/api/lessons"
        );

        expect(req.request.method).toEqual("GET")
        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({   
            payload: findLessonsForCourse(12).slice(0,3)
        })
    });

    /* executa apos cada bloco de teste */
    afterEach(() => {
        //verifica se nenhuma outra request está sendo feita além da testada
        httpTestingController.verify();
    });
});
