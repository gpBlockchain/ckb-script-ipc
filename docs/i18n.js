// Internationalization (i18n) translations
const translations = {
    en: {
        // Navigation
        nav_home: "Home",
        nav_playground: "Interactive Playground",
        nav_tutorial: "🎮 Interactive Tutorial",
        
        // Progress steps
        step1_title: "1. Define Interface",
        step2_title: "2. Implement Server",
        step3_title: "3. Create Client",
        step4_title: "4. Send Messages",
        step5_title: "5. Challenge",
        
        // Step 1
        step1_heading: "Step 1: Define Your IPC Interface",
        step1_description: "First, let's define an interface that describes the methods your server will provide. This is like creating a contract between the client and server.",
        step1_file: "📄 def.rs",
        step1_edit_hint: "Edit the code below!",
        step1_what_building: "🎯 What You're Building",
        step1_hint_title: "💡 Hint:",
        step1_hint_text: "Add this line inside the trait:",
        step1_success_title: "🎉 Great job!",
        step1_success_text: "You've defined the interface. The proc-macro will automatically generate:",
        step1_success_client: "CalculatorClient - for making calls",
        step1_success_server: "CalculatorServer - for handling requests",
        step1_next: "Next: Implement Server →",
        step1_todo_comment: "// TODO: Add a method called 'add' that takes two i32 numbers",
        step1_todo_comment2: "// and returns Result<i32, u64>",
        
        // Step 2
        step2_heading: "Step 2: Implement the Server",
        step2_description: "Now let's implement the actual logic for our Calculator service. The server will process incoming requests and return results.",
        step2_file: "📄 server.rs",
        step2_edit_hint: "Complete the implementation!",
        step2_server_status: "🖥️ Server Status",
        step2_waiting: "Waiting for implementation...",
        step2_not_impl: "add() - Not implemented",
        step2_ready: "multiply() - Ready",
        step2_hint_title: "💡 Hint:",
        step2_hint_text: "Replace the TODO comment with:",
        step2_success_title: "🎉 Server Ready!",
        step2_success_text: "Your Calculator server is now fully implemented and ready to receive requests.",
        step2_back: "← Back",
        step2_next: "Next: Create Client →",
        step2_todo_comment: "// TODO: Return Ok with a + b",
        step2_start_comment: "// Start the server",
        
        // Step 3
        step3_heading: "Step 3: Create the Client",
        step3_description: "Now let's create a client that can connect to our Calculator server and make IPC calls.",
        step3_file: "📄 client.rs",
        step3_edit_hint: "Complete the client code!",
        step3_connection: "🔗 Connection Status",
        step3_client: "Client",
        step3_server: "Server",
        step3_hint_title: "💡 Hint:",
        step3_hint_text: "Call the add method like this:",
        step3_success_title: "🎉 Client Connected!",
        step3_success_text: "You've successfully set up the client. Now you're ready to send messages!",
        step3_back: "← Back",
        step3_next: "Next: Send Messages →",
        step3_spawn_comment: "// Spawn the server process",
        step3_create_comment: "// Create the client",
        step3_todo_comment: "// TODO: Call the add method with arguments 5 and 3",
        
        // Step 4
        step4_heading: "Step 4: Send IPC Messages",
        step4_description: "Now let's see the IPC in action! Enter values and watch how messages flow between client and server.",
        step4_simulator: "🎮 IPC Simulator",
        step4_select_method: "Select Method:",
        step4_send: "📤 Send Request",
        step4_client: "Client",
        step4_server: "Server",
        step4_channel: "IPC Channel",
        step4_request: "Request →",
        step4_response: "← Response",
        step4_packet_inspector: "📦 Packet Inspector",
        step4_request_packet: "Request Packet",
        step4_response_packet: "Response Packet",
        step4_result: "📊 Result",
        step4_result_hint: 'Press "Send Request" to execute an IPC call',
        step4_ready: "// Ready to send...",
        step4_waiting: "// Waiting for request...",
        step4_back: "← Back",
        step4_next: "Next: Challenge →",
        
        // Step 5
        step5_heading: "🏆 Final Challenge",
        step5_description: "Time to test your knowledge! Complete this challenge to prove you understand CKB Script IPC.",
        step5_challenge_title: "🎯 Challenge: Build a Greeting Service",
        step5_challenge_intro: "Create an IPC service that:",
        step5_challenge_1: "Has a method called <code>greet</code> that takes a <code>String</code> name",
        step5_challenge_2: "Returns <code>Result&lt;String, u64&gt;</code>",
        step5_challenge_3: 'Returns "Hello, {name}!" when successful',
        step5_file: "📄 greeting_service.rs",
        step5_test_title: "🧪 Test Your Solution",
        step5_test1: "Interface defines greet method",
        step5_test2: "Server implements greet",
        step5_test3: "Client calls greet correctly",
        step5_badge_title: "CKB Script IPC Master",
        step5_badge_text: "Congratulations! You've completed the interactive tutorial and now understand how to use CKB Script IPC!",
        step5_next_steps: "Next Steps:",
        step5_next_1: "Explore the full documentation",
        step5_next_2: "Check out the demo project",
        step5_next_3: "See the crypto service example",
        step5_back: "← Back",
        step5_restart: "🔄 Restart Tutorial",
        step5_submit: "🏆 Submit Challenge",
        step5_hints_title: "💡 Hints:",
        step5_hint_interface: "Interface:",
        step5_hint_impl: "Implementation:",
        step5_hint_client: "Client call:",
        step5_interface_comment: "// Define the interface",
        step5_todo_greet: "// TODO: Add greet method",
        step5_server_comment: "// Implement the server",
        step5_todo_impl: "// TODO: Implement greet method",
        step5_client_comment: "// Client code",
        step5_todo_call: '// TODO: Call greet with "World"',
        step5_should_print: '// Should print: "Hello, World!"',
        
        // Quick Reference
        ref_title: "Quick Reference",
        ref_interface: "Define Interface",
        ref_server: "Implement Server",
        ref_client: "Create Client",
        
        // Buttons
        btn_hint: "💡 Show Hint",
        btn_check: "✓ Check Answer",
        btn_reset: "↺ Reset",
        
        // Notifications
        notify_correct_add: "✅ Correct! You've defined the add method.",
        notify_wrong_add: "❌ Not quite. Make sure to define the add method with correct types.",
        notify_correct_server: "✅ Correct! Server implementation is complete.",
        notify_wrong_server: "❌ Not quite. Return Ok(a + b) from the add method.",
        notify_correct_client: "✅ Correct! Client is ready to make IPC calls.",
        notify_wrong_client: "❌ Not quite. Call client.add(5, 3) to make the IPC request.",
        notify_invalid_input: "❌ Please enter valid numbers.",
        notify_ipc_success: "✅ IPC call successful!",
        notify_challenge_complete: "🎉 Congratulations! You've completed the CKB Script IPC tutorial!",
        notify_challenge_fail: "❌ Some tests failed. Check the hints and try again.",
        notify_restart: "🔄 Tutorial restarted. Let's go!",
        
        // Language
        lang_switch: "中文"
    },
    
    zh: {
        // Navigation
        nav_home: "首页",
        nav_playground: "交互式教程",
        nav_tutorial: "🎮 交互式教程",
        
        // Progress steps
        step1_title: "1. 定义接口",
        step2_title: "2. 实现服务端",
        step3_title: "3. 创建客户端",
        step4_title: "4. 发送消息",
        step5_title: "5. 挑战",
        
        // Step 1
        step1_heading: "第一步：定义你的 IPC 接口",
        step1_description: "首先，让我们定义一个接口，描述服务器将提供的方法。这就像在客户端和服务端之间创建一个契约。",
        step1_file: "📄 def.rs",
        step1_edit_hint: "编辑下面的代码！",
        step1_what_building: "🎯 你正在构建的内容",
        step1_hint_title: "💡 提示：",
        step1_hint_text: "在 trait 中添加这一行：",
        step1_success_title: "🎉 做得好！",
        step1_success_text: "你已经定义了接口。proc-macro 会自动生成：",
        step1_success_client: "CalculatorClient - 用于发起调用",
        step1_success_server: "CalculatorServer - 用于处理请求",
        step1_next: "下一步：实现服务端 →",
        step1_todo_comment: "// 待办：添加一个名为 'add' 的方法，接收两个 i32 数字",
        step1_todo_comment2: "// 并返回 Result<i32, u64>",
        
        // Step 2
        step2_heading: "第二步：实现服务端",
        step2_description: "现在让我们实现 Calculator 服务的实际逻辑。服务端将处理传入的请求并返回结果。",
        step2_file: "📄 server.rs",
        step2_edit_hint: "完成实现！",
        step2_server_status: "🖥️ 服务器状态",
        step2_waiting: "等待实现...",
        step2_not_impl: "add() - 未实现",
        step2_ready: "multiply() - 就绪",
        step2_hint_title: "💡 提示：",
        step2_hint_text: "将 TODO 注释替换为：",
        step2_success_title: "🎉 服务器就绪！",
        step2_success_text: "你的 Calculator 服务器已完全实现，准备好接收请求了。",
        step2_back: "← 返回",
        step2_next: "下一步：创建客户端 →",
        step2_todo_comment: "// 待办：返回 Ok(a + b)",
        step2_start_comment: "// 启动服务器",
        
        // Step 3
        step3_heading: "第三步：创建客户端",
        step3_description: "现在让我们创建一个客户端，它可以连接到我们的 Calculator 服务器并进行 IPC 调用。",
        step3_file: "📄 client.rs",
        step3_edit_hint: "完成客户端代码！",
        step3_connection: "🔗 连接状态",
        step3_client: "客户端",
        step3_server: "服务端",
        step3_hint_title: "💡 提示：",
        step3_hint_text: "像这样调用 add 方法：",
        step3_success_title: "🎉 客户端已连接！",
        step3_success_text: "你已成功设置客户端。现在你准备好发送消息了！",
        step3_back: "← 返回",
        step3_next: "下一步：发送消息 →",
        step3_spawn_comment: "// 启动服务器进程",
        step3_create_comment: "// 创建客户端",
        step3_todo_comment: "// 待办：使用参数 5 和 3 调用 add 方法",
        
        // Step 4
        step4_heading: "第四步：发送 IPC 消息",
        step4_description: "现在让我们看看 IPC 的实际运行！输入数值，观察消息如何在客户端和服务端之间流动。",
        step4_simulator: "🎮 IPC 模拟器",
        step4_select_method: "选择方法：",
        step4_send: "📤 发送请求",
        step4_client: "客户端",
        step4_server: "服务端",
        step4_channel: "IPC 通道",
        step4_request: "请求 →",
        step4_response: "← 响应",
        step4_packet_inspector: "📦 数据包检查器",
        step4_request_packet: "请求数据包",
        step4_response_packet: "响应数据包",
        step4_result: "📊 结果",
        step4_result_hint: '点击 "发送请求" 执行 IPC 调用',
        step4_ready: "// 准备发送...",
        step4_waiting: "// 等待请求...",
        step4_back: "← 返回",
        step4_next: "下一步：挑战 →",
        
        // Step 5
        step5_heading: "🏆 最终挑战",
        step5_description: "是时候测试你的知识了！完成这个挑战来证明你理解了 CKB Script IPC。",
        step5_challenge_title: "🎯 挑战：构建一个问候服务",
        step5_challenge_intro: "创建一个 IPC 服务：",
        step5_challenge_1: "有一个名为 <code>greet</code> 的方法，接收一个 <code>String</code> 类型的名字",
        step5_challenge_2: "返回 <code>Result&lt;String, u64&gt;</code>",
        step5_challenge_3: '成功时返回 "Hello, {name}!"',
        step5_file: "📄 greeting_service.rs",
        step5_test_title: "🧪 测试你的解答",
        step5_test1: "接口定义了 greet 方法",
        step5_test2: "服务端实现了 greet",
        step5_test3: "客户端正确调用了 greet",
        step5_badge_title: "CKB Script IPC 大师",
        step5_badge_text: "恭喜！你已完成交互式教程，现在理解了如何使用 CKB Script IPC！",
        step5_next_steps: "下一步：",
        step5_next_1: "探索完整文档",
        step5_next_2: "查看示例项目",
        step5_next_3: "查看加密服务示例",
        step5_back: "← 返回",
        step5_restart: "🔄 重新开始教程",
        step5_submit: "🏆 提交挑战",
        step5_hints_title: "💡 提示：",
        step5_hint_interface: "接口：",
        step5_hint_impl: "实现：",
        step5_hint_client: "客户端调用：",
        step5_interface_comment: "// 定义接口",
        step5_todo_greet: "// 待办：添加 greet 方法",
        step5_server_comment: "// 实现服务端",
        step5_todo_impl: "// 待办：实现 greet 方法",
        step5_client_comment: "// 客户端代码",
        step5_todo_call: '// 待办：使用 "World" 调用 greet',
        step5_should_print: '// 应该打印："Hello, World!"',
        
        // Quick Reference
        ref_title: "快速参考",
        ref_interface: "定义接口",
        ref_server: "实现服务端",
        ref_client: "创建客户端",
        
        // Buttons
        btn_hint: "💡 显示提示",
        btn_check: "✓ 检查答案",
        btn_reset: "↺ 重置",
        
        // Notifications
        notify_correct_add: "✅ 正确！你已定义了 add 方法。",
        notify_wrong_add: "❌ 不太对。确保使用正确的类型定义 add 方法。",
        notify_correct_server: "✅ 正确！服务端实现完成。",
        notify_wrong_server: "❌ 不太对。从 add 方法返回 Ok(a + b)。",
        notify_correct_client: "✅ 正确！客户端已准备好进行 IPC 调用。",
        notify_wrong_client: "❌ 不太对。调用 client.add(5, 3) 来发起 IPC 请求。",
        notify_invalid_input: "❌ 请输入有效的数字。",
        notify_ipc_success: "✅ IPC 调用成功！",
        notify_challenge_complete: "🎉 恭喜！你已完成 CKB Script IPC 教程！",
        notify_challenge_fail: "❌ 部分测试失败。查看提示并重试。",
        notify_restart: "🔄 教程已重新开始。开始吧！",
        
        // Language
        lang_switch: "English"
    }
};

// Current language
let currentLang = localStorage.getItem('ckb-ipc-lang') || 'en';

// Get translation
function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

// Switch language
function switchLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('ckb-ipc-lang', currentLang);
    applyTranslations();
    updateLangButton();
}

// Update language button text
function updateLangButton() {
    const langBtn = document.getElementById('langSwitch');
    if (langBtn) {
        langBtn.textContent = t('lang_switch');
    }
}

// Apply translations to the page
function applyTranslations() {
    // Keys that contain HTML and need innerHTML (these are trusted, hardcoded values)
    const htmlKeys = new Set([
        'step5_challenge_1', 
        'step5_challenge_2'
    ]);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translation;
        } else if (htmlKeys.has(key)) {
            // Only use innerHTML for known-safe keys with HTML content
            el.innerHTML = translation;
        } else {
            // Use textContent for all other translations (safer)
            el.textContent = translation;
        }
    });
    
    // Update page title
    document.title = currentLang === 'zh' ? 
        'CKB Script IPC - 交互式教程' : 
        'CKB Script IPC - Interactive Playground';
}

// Initialize i18n on page load
function initI18n() {
    applyTranslations();
    updateLangButton();
}

// Export for use in playground.js
window.i18n = {
    t,
    switchLanguage,
    currentLang: () => currentLang,
    init: initI18n
};
