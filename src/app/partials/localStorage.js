
import secureLocalStorage from "react-secure-storage";


export const resetLocal = async (page = "all") => {
    const pageName = await page
    if (pageName !== "student") {
        if (secureLocalStorage.getItem("studentSortingFilter")) {
            secureLocalStorage.removeItem("studentSortingFilter")
        }
        if (secureLocalStorage.getItem("studentSectionFilter")) {
            secureLocalStorage.removeItem("studentSectionFilter")
        }
        if (secureLocalStorage.getItem("studentClassFilter")) {
            secureLocalStorage.removeItem("studentClassFilter")
        }
        if (secureLocalStorage.getItem("studentSessionFilter")) {
            secureLocalStorage.removeItem("studentSessionFilter")
        }
        if (secureLocalStorage.getItem("studentCurrentPage")) {
            secureLocalStorage.removeItem("studentCurrentPage")
        }
        if (secureLocalStorage.getItem("studentPerPage")) {
            secureLocalStorage.removeItem("studentPerPage")
        }
    }
    if (pageName !== "result" && pageName !== "result2") {
        if (secureLocalStorage.getItem("resultSessionFilter")) {
            secureLocalStorage.removeItem("resultSessionFilter")
        }
        if (secureLocalStorage.getItem("resultClassFilter")) {
            secureLocalStorage.removeItem("resultClassFilter")
        }
        if (secureLocalStorage.getItem("resultSectionFilter")) {
            secureLocalStorage.removeItem("resultSectionFilter")
        }
        if (secureLocalStorage.getItem("resultTestFilter")) {
            secureLocalStorage.removeItem("resultTestFilter")
        }
        if (secureLocalStorage.getItem("resultSortingFilter")) {
            secureLocalStorage.removeItem("resultSortingFilter")
        }
        if (secureLocalStorage.getItem("resultSubTestFilter")) {
            secureLocalStorage.removeItem("resultSubTestFilter")
        }

        if (secureLocalStorage.getItem("resultCurrentPage")) {
            secureLocalStorage.removeItem("resultCurrentPage")
        }
        if (secureLocalStorage.getItem("resultPerPage")) {
            secureLocalStorage.removeItem("resultPerPage")
        }
    }

    if(pageName !== "result2"){
        if (secureLocalStorage.getItem("editableThings")) {
            secureLocalStorage.removeItem("editableThings")
        }
        if (secureLocalStorage.getItem("editableSx")) {
            secureLocalStorage.removeItem("editableSx")
        }
        if (secureLocalStorage.getItem("resultDetail")) {
            secureLocalStorage.removeItem("resultDetail")
        }
        if (secureLocalStorage.getItem("studentDetailsre")) {
            secureLocalStorage.removeItem("studentDetailsre")
        }
    }

    if (pageName !== "cocurricular") {
        if (secureLocalStorage.getItem("cocurricularSessionFilter")) {
            secureLocalStorage.removeItem("cocurricularSessionFilter")
        }
        if (secureLocalStorage.getItem("cocurricularCatergoryFilter")) {
            secureLocalStorage.removeItem("cocurricularCatergoryFilter")
        }
        if (secureLocalStorage.getItem("cocurricularMonthFilter")) {
            secureLocalStorage.removeItem("cocurricularMonthFilter")
        }
        if (secureLocalStorage.getItem("cocurricularSortingFilter")) {
            secureLocalStorage.removeItem("cocurricularSortingFilter")
        }
        if (secureLocalStorage.getItem("cocurricularTypeFilter")) {
            secureLocalStorage.removeItem("cocurricularTypeFilter")
        }
        if (secureLocalStorage.getItem("cocurricularEventTypeFilter")) {
            secureLocalStorage.removeItem("cocurricularEventTypeFilter")
        }
        if (secureLocalStorage.getItem("cocurricularPerPage")) {
            secureLocalStorage.removeItem("cocurricularPerPage")
        }
        if (secureLocalStorage.getItem("cocurricularCurrentPage")) {
            secureLocalStorage.removeItem("cocurricularCurrentPage")
        }
    }
    if (pageName !== "infra") {
        if (secureLocalStorage.getItem("infraTestPatternSession")) {
            secureLocalStorage.removeItem("infraTestPatternSession")
        }

        if (secureLocalStorage.getItem("infraClassSectionSession")) {
            secureLocalStorage.removeItem("infraClassSectionSession")
        }
        if (secureLocalStorage.getItem("infraClassSectionClass")) {
            secureLocalStorage.removeItem("infraClassSectionClass")
        }
        if (secureLocalStorage.getItem("infraClassSectionSec")) {
            secureLocalStorage.removeItem("infraClassSectionSec")
        }
        if (secureLocalStorage.getItem("classSectionPage")) {
            secureLocalStorage.removeItem("classSectionPage")
        }
        if (secureLocalStorage.getItem("classSectionRowsPerPage")) {
            secureLocalStorage.removeItem("classSectionRowsPerPage")
        }

        if (secureLocalStorage.getItem("infraTeacherSession")) {
            secureLocalStorage.removeItem("infraTeacherSession")
        }
        if (secureLocalStorage.getItem("infraTeacherClass")) {
            secureLocalStorage.removeItem("infraTeacherClass")
        }
        if (secureLocalStorage.getItem("infraTeacherSection")) {
            secureLocalStorage.removeItem("infraTeacherSection")
        }
        if (secureLocalStorage.getItem("teacherPage")) {
            secureLocalStorage.removeItem("teacherPage")
        }
        if (secureLocalStorage.getItem("teacherRowsPerPage")) {
            secureLocalStorage.removeItem("teacherRowsPerPage")
        }

        if (secureLocalStorage.getItem("infraSubjectSession")) {
            secureLocalStorage.removeItem("infraSubjectSession")
        }
        if (secureLocalStorage.getItem("infraSubjectClass")) {
            secureLocalStorage.removeItem("infraSubjectClass")
        }
        if (secureLocalStorage.getItem("infraSubjectSection")) {
            secureLocalStorage.removeItem("infraSubjectSection")
        }
        if (secureLocalStorage.getItem("infraSubjectType")) {
            secureLocalStorage.removeItem("infraSubjectType")
        }
        if (secureLocalStorage.getItem("subjectPage")) {
            secureLocalStorage.removeItem("subjectPage")
        }
        if (secureLocalStorage.getItem("subjectRowsPerPage")) {
            secureLocalStorage.removeItem("subjectRowsPerPage")
        }
    }
}
