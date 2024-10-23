function fetchStudentAnswers() {
    const registerNo = document.getElementById('faculty-register-no').value.trim();
    if (!registerNo) {
        alert('Please enter a register number.');
        return;
    }

    fetch(`http://localhost:3000/get-answers/${registerNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No answers found for the provided register number.');
            }
            return response.json();
        })
        .then(data => {
            displayStudentAnswers(data.answers);
            document.getElementById('student-reg-no').textContent = data.registerNo;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}

function displayStudentAnswers(studentAnswers) {
    const container = document.getElementById("student-answers");
    let htmlContent = "";

    htmlContent += "<h3>MCQ Questions</h3>";
    studentAnswers.mcqs.forEach((q, index) => {
        htmlContent += `<div class="question">
            <label>${index + 1}: ${q.question}</label>
            <div class="answer">${q.selectedAnswer}</div>
            <div class="score">Marks <input class="mcq-score" type="number" min="0" max="1" step="1" value="${q.selectedAnswer === q.correctAnswer ? 1 : 0}"></div>
        </div>`;
    });

    htmlContent += "<h3> Short Answer </h3>";
    studentAnswers.shortAnswers.forEach((q, index) => {
        htmlContent += `<div class="question">
            <label>${index + 1}: ${q.question}</label>
            <textarea class="textarea" rows="3" readonly>${q.answer}</textarea>
            <div class="score">Marks <input class="short-answer-score" type="number" min="0" max="2" step="1"></div>
        </div>`;
    });

    htmlContent += "<h3> Long Answer </h3>";
    studentAnswers.longAnswers.forEach((q, index) => {
        htmlContent += `<div class="question">
            <label>${index + 1}: ${q.question}</label>
            <textarea class="textarea" rows="20" readonly>${q.answer}</textarea>
            <div class="score">Marks <input class="long-answer-score" type="number" min="0" max="14" step="1"></div>
        </div>`;
    });
    
    container.innerHTML = htmlContent;
}

function calculateTotalMarks() {
    const mcqMarks = document.querySelectorAll('.mcq-score');
    const shortAnswerMarks = document.querySelectorAll('.short-answer-score');
    const longAnswerMarks = document.querySelectorAll('.long-answer-score');

    let mcqTotal = 0, shortAnswerTotal = 0, longAnswerTotal = 0;

    mcqMarks.forEach(input => mcqTotal += parseFloat(input.value) || 0);
    shortAnswerMarks.forEach(input => shortAnswerTotal += parseFloat(input.value) || 0);
    longAnswerMarks.forEach(input => longAnswerTotal += parseFloat(input.value) || 0);

    const totalMarks = mcqTotal + shortAnswerTotal + longAnswerTotal;

    // Fetch max values from faculty input
    const mcqMax = parseInt(document.getElementById('mcq-max').value);
    const shortAnswerMax = parseInt(document.getElementById('short-answer-max').value);
    const longAnswerMax = parseInt(document.getElementById('long-answer-max').value);
    const maxMarks = parseInt(document.getElementById('max-marks').value);

    document.getElementById('mcq-score').textContent = mcqTotal;
    document.getElementById('short-answer-score').textContent = shortAnswerTotal;
    document.getElementById('long-answer-score').textContent = longAnswerTotal;
    document.getElementById('total-marks').textContent = totalMarks;

    document.getElementById('mcq-max-display').textContent = mcqMax;
    document.getElementById('short-answer-max-display').textContent = shortAnswerMax;
    document.getElementById('long-answer-max-display').textContent = longAnswerMax;
    document.getElementById('max-marks-display').textContent = maxMarks;

    const grade = calculateGrade(totalMarks, maxMarks);
    document.getElementById('grade').textContent = grade;
}

function calculateGrade(totalMarks, maxMarks) {
    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 90) {
        return 'A+';
    } else if (percentage >= 80) {
        return 'A';
    } else if (percentage >= 70) {
        return 'B+';
    } else if (percentage >= 60) {
        return 'B';
    } else if (percentage >= 50) {
        return 'C';
    } else {
        return 'Fail';
    }
}

function submitEvaluation() {
    calculateTotalMarks();
    alert("Evaluation submitted successfully!");
    // Normally you would send the scores to the backend here
}