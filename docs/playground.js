// State management
let currentStep = 1;
let completedSteps = new Set();

// Original editor content for reset
const originalContent = {
    1: `<span class="keyword">use</span> alloc::string::String;

<span class="comment">// Define your IPC interface</span>
<span class="attribute">#[ckb_script_ipc::service]</span>
<span class="keyword">pub trait</span> <span class="type">Calculator</span> {
    <span class="comment">// TODO: Add a method called 'add' that takes two i32 numbers</span>
    <span class="comment">// and returns Result&lt;i32, u64&gt;</span>
    
    <span class="keyword">fn</span> <span class="function">multiply</span>(a: <span class="type">i32</span>, b: <span class="type">i32</span>) -> <span class="type">Result</span>&lt;<span class="type">i32</span>, <span class="type">u64</span>&gt;;
}`,
    2: `<span class="keyword">struct</span> <span class="type">CalculatorServer</span>;

<span class="keyword">impl</span> <span class="type">Calculator</span> <span class="keyword">for</span> <span class="type">CalculatorServer</span> {
    <span class="keyword">fn</span> <span class="function">add</span>(&amp;<span class="keyword">mut</span> <span class="keyword">self</span>, a: <span class="type">i32</span>, b: <span class="type">i32</span>) -> <span class="type">Result</span>&lt;<span class="type">i32</span>, <span class="type">u64</span>&gt; {
        <span class="comment">// TODO: Return Ok with a + b</span>
        
    }

    <span class="keyword">fn</span> <span class="function">multiply</span>(&amp;<span class="keyword">mut</span> <span class="keyword">self</span>, a: <span class="type">i32</span>, b: <span class="type">i32</span>) -> <span class="type">Result</span>&lt;<span class="type">i32</span>, <span class="type">u64</span>&gt; {
        <span class="type">Ok</span>(a * b)
    }
}

<span class="comment">// Start the server</span>
run_server(CalculatorServer.server())`,
    3: `<span class="comment">// Spawn the server process</span>
<span class="keyword">let</span> (read_pipe, write_pipe) = spawn_server(
    <span class="number">0</span>,
    Source::CellDep,
    &amp;[CString::new(<span class="string">"calculator"</span>).unwrap().as_ref()],
)?;

<span class="comment">// Create the client</span>
<span class="keyword">let mut</span> client = CalculatorClient::new(read_pipe, write_pipe);

<span class="comment">// TODO: Call the add method with arguments 5 and 3</span>
<span class="keyword">let</span> result = <span class="comment">/* your code here */</span>;

println!(<span class="string">"Result: {:?}"</span>, result);`,
    5: `<span class="comment">// Define the interface</span>
<span class="attribute">#[ckb_script_ipc::service]</span>
<span class="keyword">pub trait</span> <span class="type">Greeter</span> {
    <span class="comment">// TODO: Add greet method</span>
    
}

<span class="comment">// Implement the server</span>
<span class="keyword">struct</span> <span class="type">GreeterServer</span>;

<span class="keyword">impl</span> <span class="type">Greeter</span> <span class="keyword">for</span> <span class="type">GreeterServer</span> {
    <span class="comment">// TODO: Implement greet method</span>
    
}

<span class="comment">// Client code</span>
<span class="keyword">let mut</span> client = GreeterClient::new(read_pipe, write_pipe);
<span class="keyword">let</span> result = <span class="comment">/* TODO: Call greet with "World" */</span>;
<span class="comment">// Should print: "Hello, World!"</span>`
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize i18n first
    if (window.i18n) {
        window.i18n.init();
    }
    initStepButtons();
    updateProgress();
});

// Step Navigation
function initStepButtons() {
    const stepBtns = document.querySelectorAll('.step-btn');
    stepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            goToStep(step);
        });
    });
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.tutorial-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    
    // Show target step
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelector(`.step-btn[data-step="${step}"]`).classList.add('active');
    
    currentStep = step;
    updateProgress();
}

function nextStep(step) {
    completedSteps.add(currentStep);
    document.querySelector(`.step-btn[data-step="${currentStep}"]`).classList.add('completed');
    goToStep(step);
}

function prevStep(step) {
    goToStep(step);
}

function updateProgress() {
    const totalSteps = 5;
    const progress = (completedSteps.size / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${Math.max(20, progress)}%`;
}

// Hint System
function showHint(step) {
    const hintBox = document.getElementById(`hint${step}`);
    hintBox.classList.toggle('hidden');
}

// Reset Editor
function resetEditor(step) {
    const editor = document.getElementById(`editor${step}`);
    editor.innerHTML = originalContent[step];
    
    // Hide success message
    const successBox = document.getElementById(`success${step}`);
    if (successBox) successBox.classList.add('hidden');
    
    // Disable next button
    const nextBtn = document.getElementById(`next${step}`);
    if (nextBtn) nextBtn.disabled = true;
    
    // Reset visualizations based on step
    if (step === 1) {
        document.getElementById('addMethodStatus').classList.remove('detected');
        document.getElementById('addMethodStatus').classList.add('missing');
    } else if (step === 2) {
        document.getElementById('addImpl').innerHTML = '<span class="status-dot pending"></span>add() - Not implemented';
        document.getElementById('serverBox').classList.remove('ready');
    }
}

// Step 1: Check Interface Definition
function checkStep1() {
    const editor = document.getElementById('editor1');
    const content = editor.textContent || editor.innerText;
    
    // Check if add method is defined
    const hasAddMethod = content.includes('fn add') && 
                         content.includes('i32') && 
                         content.includes('Result');
    
    if (hasAddMethod) {
        // Update visualization
        const addStatus = document.getElementById('addMethodStatus');
        addStatus.classList.remove('missing');
        addStatus.classList.add('detected');
        addStatus.innerHTML = '<span class="method-icon">✓</span><code>add(a, b) → i32</code>';
        
        // Show success
        document.getElementById('success1').classList.remove('hidden');
        document.getElementById('hint1').classList.add('hidden');
        
        // Enable next button
        document.getElementById('next1').disabled = false;
        
        showNotification(window.i18n ? window.i18n.t('notify_correct_add') : '✅ Correct! You\'ve defined the add method.', 'success');
    } else {
        showNotification(window.i18n ? window.i18n.t('notify_wrong_add') : '❌ Not quite. Make sure to define the add method with correct types.', 'error');
    }
}

// Step 2: Check Server Implementation
function checkStep2() {
    const editor = document.getElementById('editor2');
    const content = editor.textContent || editor.innerText;
    
    // Check if add method returns Ok(a + b)
    const hasCorrectImpl = content.includes('Ok(a + b)') || 
                           content.includes('Ok(a+b)');
    
    if (hasCorrectImpl) {
        // Update visualization
        document.getElementById('addImpl').innerHTML = '<span class="status-dot ready"></span>add() - Ready';
        document.getElementById('serverBox').classList.add('ready');
        document.querySelector('#serverBox .server-status').textContent = 'Server Ready!';
        
        // Show success
        document.getElementById('success2').classList.remove('hidden');
        document.getElementById('hint2').classList.add('hidden');
        
        // Enable next button
        document.getElementById('next2').disabled = false;
        
        showNotification(window.i18n ? window.i18n.t('notify_correct_server') : '✅ Correct! Server implementation is complete.', 'success');
    } else {
        showNotification(window.i18n ? window.i18n.t('notify_wrong_server') : '❌ Not quite. Return Ok(a + b) from the add method.', 'error');
    }
}

// Step 3: Check Client Code
function checkStep3() {
    const editor = document.getElementById('editor3');
    const content = editor.textContent || editor.innerText;
    
    // Check if client calls add correctly
    const hasCorrectCall = content.includes('client.add(5, 3)') || 
                           content.includes('client.add(5,3)');
    
    if (hasCorrectCall) {
        // Animate connection
        document.getElementById('pipeConnection').classList.add('connected');
        
        // Show success
        document.getElementById('success3').classList.remove('hidden');
        document.getElementById('hint3').classList.add('hidden');
        
        // Enable next button
        document.getElementById('next3').disabled = false;
        
        showNotification(window.i18n ? window.i18n.t('notify_correct_client') : '✅ Correct! Client is ready to make IPC calls.', 'success');
    } else {
        showNotification(window.i18n ? window.i18n.t('notify_wrong_client') : '❌ Not quite. Call client.add(5, 3) to make the IPC request.', 'error');
    }
}

// Step 4: IPC Simulator
function sendIPCMessage() {
    const method = document.getElementById('methodSelect').value;
    const a = parseInt(document.getElementById('inputA').value);
    const b = parseInt(document.getElementById('inputB').value);
    
    // Validate inputs
    if (isNaN(a) || isNaN(b)) {
        showNotification(window.i18n ? window.i18n.t('notify_invalid_input') : '❌ Please enter valid numbers.', 'error');
        return;
    }
    
    // Calculate result
    let result;
    if (method === 'add') {
        result = a + b;
    } else if (method === 'multiply') {
        result = a * b;
    }
    
    // Animate the request
    animateIPCFlow(method, a, b, result);
}

function animateIPCFlow(method, a, b, result) {
    const clientCode = document.getElementById('clientCode');
    const serverCode = document.getElementById('serverCode');
    const requestPacket = document.getElementById('requestPacket');
    const responsePacket = document.getElementById('responsePacket');
    const requestFields = document.getElementById('requestFields');
    const responseFields = document.getElementById('responseFields');
    const resultValue = document.getElementById('resultValue');
    
    // Method IDs
    const methodIds = { add: 0, multiply: 1 };
    const methodId = methodIds[method];
    
    // Create payload
    const payload = JSON.stringify([a, b]);
    
    // Step 1: Client prepares request
    clientCode.innerHTML = `<span class="keyword">let</span> result = client.${method}(${a}, ${b});`;
    
    // Step 2: Show request packet formation
    setTimeout(() => {
        requestFields.innerHTML = `
            <div class="field"><span class="field-name">version:</span> <span class="field-value">0</span></div>
            <div class="field"><span class="field-name">method_id:</span> <span class="field-value">${methodId}</span></div>
            <div class="field"><span class="field-name">length:</span> <span class="field-value">${payload.length}</span></div>
            <div class="field"><span class="field-name">payload:</span> <span class="field-value">${payload}</span></div>
        `;
        requestPacket.classList.add('sending');
        requestPacket.querySelector('.packet-content').textContent = `{method: ${methodId}, args: [${a}, ${b}]}`;
    }, 200);
    
    // Step 3: Server receives and processes
    setTimeout(() => {
        requestPacket.classList.remove('sending');
        serverCode.innerHTML = `<span class="keyword">fn</span> ${method}(${a}, ${b}) {
    <span class="type">Ok</span>(${result})
}`;
    }, 1200);
    
    // Step 4: Server sends response
    setTimeout(() => {
        const responsePayload = JSON.stringify(result);
        responseFields.innerHTML = `
            <div class="field"><span class="field-name">version:</span> <span class="field-value">0</span></div>
            <div class="field"><span class="field-name">error_code:</span> <span class="field-value">0 (OK)</span></div>
            <div class="field"><span class="field-name">length:</span> <span class="field-value">${responsePayload.length}</span></div>
            <div class="field"><span class="field-name">payload:</span> <span class="field-value">${responsePayload}</span></div>
        `;
        responsePacket.classList.add('receiving');
        responsePacket.querySelector('.packet-content').textContent = `{result: ${result}}`;
    }, 1700);
    
    // Step 5: Client receives response
    setTimeout(() => {
        responsePacket.classList.remove('receiving');
        clientCode.innerHTML = `<span class="keyword">let</span> result = client.${method}(${a}, ${b});
<span class="comment">// result = Ok(${result})</span>`;
        
        resultValue.innerHTML = `<span class="method-name">${method}(${a}, ${b})</span> = <span class="result-number">${result}</span>`;
        resultValue.classList.remove('error');
        
        const successMsg = window.i18n ? window.i18n.t('notify_ipc_success') : '✅ IPC call successful!';
        showNotification(`${successMsg} ${method}(${a}, ${b}) = ${result}`, 'success');
    }, 2200);
}

// Step 5: Challenge
function checkChallenge() {
    const editor = document.getElementById('editor5');
    const content = editor.textContent || editor.innerText;
    
    // Test 1: Interface defines greet method
    const test1 = content.includes('fn greet') && 
                  content.includes('String') && 
                  content.includes('Result');
    
    // Test 2: Server implements greet
    const test2 = content.includes('format!') && 
                  (content.includes('Hello') || content.includes('hello'));
    
    // Test 3: Client calls greet
    const test3 = content.includes('client.greet') && 
                  content.includes('World');
    
    // Update test results
    updateTestResult('test1', test1);
    updateTestResult('test2', test2);
    updateTestResult('test3', test3);
    
    if (test1 && test2 && test3) {
        // Show completion badge
        document.getElementById('completionBadge').classList.remove('hidden');
        document.getElementById('challengeTest').style.display = 'none';
        
        completedSteps.add(5);
        document.querySelector('.step-btn[data-step="5"]').classList.add('completed');
        updateProgress();
        
        showNotification(window.i18n ? window.i18n.t('notify_challenge_complete') : '🎉 Congratulations! You\'ve completed the CKB Script IPC tutorial!', 'success');
        
        // Confetti effect
        createConfetti();
    } else {
        showNotification(window.i18n ? window.i18n.t('notify_challenge_fail') : '❌ Some tests failed. Check the hints and try again.', 'error');
    }
}

function updateTestResult(testId, passed) {
    const testEl = document.getElementById(testId);
    testEl.classList.remove('passed', 'failed');
    testEl.classList.add(passed ? 'passed' : 'failed');
    testEl.querySelector('.test-icon').textContent = passed ? '✅' : '❌';
}

// Notification System
function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 2000;
        animation: slideDown 0.3s ease;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Quick Reference Toggle
function toggleReference() {
    document.getElementById('quickReference').classList.toggle('open');
}

// Restart Tutorial
function restartTutorial() {
    completedSteps.clear();
    
    // Reset all steps
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.classList.remove('completed');
    });
    
    // Reset all editors
    [1, 2, 3, 5].forEach(step => resetEditor(step));
    
    // Reset challenge test
    document.getElementById('challengeTest').style.display = 'block';
    document.getElementById('completionBadge').classList.add('hidden');
    ['test1', 'test2', 'test3'].forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('passed', 'failed');
        el.querySelector('.test-icon').textContent = '⏳';
    });
    
    // Go to step 1
    goToStep(1);
    
    showNotification(window.i18n ? window.i18n.t('notify_restart') : '🔄 Tutorial restarted. Let\'s go!', 'success');
}

// Confetti Effect
function createConfetti() {
    const colors = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 3000;
            pointer-events: none;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideUp {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
