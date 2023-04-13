import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

xdescribe("CalculatorService", () => {
    let calculator: CalculatorService;
    let loggerSpy: any;

    /* Executa antes de cada teste | Evita "sujeira" */
    beforeEach(() => {
        console.log("Chamando beforeEach")
        /* criando spy do loggerService ao invez de instanciar o serviço
        let logger = new LoggerService() | */
        loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

        /* depenedcy injection como se fosse um construtor */
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {provide: LoggerService, useValue: loggerSpy}
            ]
        })

        /* pode ser 'inject' ou 'get' */
        calculator = TestBed.inject(CalculatorService)
    });

    /* Teste adição */
    //fit -> focus it | executa apenas este teste dessa suit
    //xit -> exclude it | não executa este teste dessa suit
    it("should Add 2 Numbers", () => {
        console.log("teste de adição")
        const result = calculator.add(2, 2);
        expect(result).toBe(4, "unexpcted addition");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    /* Teste subtração */
    it("should subtract 2 Numbers", () => {
        console.log("teste de subtração")
        const result = calculator.subtract(4, 2);
        expect(result).toBe(2, "unexpected subtraction");
    });
});
