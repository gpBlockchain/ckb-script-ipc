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
        
        // Index page - Navigation
        index_nav_features: "Features",
        index_nav_how_works: "How It Works",
        index_nav_examples: "Examples",
        index_nav_faq: "FAQ",
        
        // Index page - Hero Section
        index_hero_badge: "🚀 Open Source",
        index_hero_title: "CKB Script IPC",
        index_hero_subtitle_1: "Make CKB contracts interact like",
        index_hero_subtitle_2: "building blocks",
        index_hero_subtitle_3: "",
        index_hero_description: "A powerful Inter-Process Communication protocol that enables seamless communication between CKB scripts. Build modular, reusable, and composable smart contracts.",
        index_hero_btn_tutorial: "🎮 Start Interactive Tutorial",
        index_hero_btn_learn: "Learn More",
        index_hero_stat1_num: "Rust & C",
        index_hero_stat1_label: "Multi-Language Support",
        index_hero_stat2_num: "VLQ",
        index_hero_stat2_label: "Compact Wire Format",
        index_hero_stat3_num: "Serde",
        index_hero_stat3_label: "JSON Serialization",
        index_hero_script_a: "Script A",
        index_hero_script_b: "Script B",
        index_hero_script_c: "Script C",
        
        // Index page - Features Section
        index_features_title: "Why CKB Script IPC?",
        index_features_subtitle: "Build smarter contracts with modular, reusable components",
        index_feature1_title: "Modular Design",
        index_feature1_desc: "Split complex logic into separate scripts that communicate seamlessly. Build once, reuse everywhere.",
        index_feature2_title: "Automatic Code Generation",
        index_feature2_desc: "Use proc-macros to automatically generate IPC boilerplate code. Focus on your business logic, not plumbing.",
        index_feature3_title: "Easy Serialization",
        index_feature3_desc: "Built-in support for serde serialization. Any type that implements Serialize/Deserialize works out of the box.",
        index_feature4_title: "Type Safety",
        index_feature4_desc: "Strong type checking at compile time. Catch errors before deployment, not in production.",
        index_feature5_title: "Compact Protocol",
        index_feature5_desc: "Uses VLQ (Variable-Length Quantity) encoding for efficient wire format. Minimal overhead, maximum performance.",
        index_feature6_title: "Multi-Language Support",
        index_feature6_desc: "Implementations in both Rust and C. Choose the language that fits your project best.",
        
        // Index page - How It Works Section
        index_how_title: "How It Works",
        index_how_subtitle: "Simple concepts, powerful results",
        index_how_client: "Client Script",
        index_how_server: "Server Script",
        index_how_request: "Request (VLQ)",
        index_how_response: "Response (VLQ)",
        index_protocol_title: "Wire Protocol Format",
        index_protocol_request: "📤 Request Packet",
        index_protocol_response: "📥 Response Packet",
        
        // Index page - Code Examples Section
        index_examples_title: "Code Examples",
        index_examples_subtitle: "See how easy it is to use CKB Script IPC",
        index_examples_tab1: "1. Define Interface",
        index_examples_tab2: "2. Implement Server",
        index_examples_tab3: "3. Create Client",
        
        // Index page - Use Cases Section
        index_usecases_title: "Real World Use Cases",
        index_usecases_subtitle: "See what you can build with CKB Script IPC",
        index_usecase1_title: "Crypto Services",
        index_usecase1_desc: "Build reusable cryptographic services that multiple scripts can share:",
        index_usecase1_item1: "Blake2b, SHA-256, RIPEMD-160 hashing",
        index_usecase1_item2: "Secp256k1 signature verification",
        index_usecase1_item3: "Schnorr and Ed25519 signatures",
        index_usecase1_link: "View Example →",
        index_usecase2_title: "Complex Computation",
        index_usecase2_desc: "Offload heavy computation to specialized scripts:",
        index_usecase2_item1: "Mathematical operations",
        index_usecase2_item2: "Data validation logic",
        index_usecase2_item3: "Protocol-specific calculations",
        index_usecase3_title: "Composable Contracts",
        index_usecase3_desc: "Build contracts that work together like LEGO blocks:",
        index_usecase3_item1: "Modular authentication",
        index_usecase3_item2: "Shared state management",
        index_usecase3_item3: "Plugin architecture",
        
        // Index page - Getting Started Section
        index_started_title: "Getting Started",
        index_started_subtitle: "Start building with CKB Script IPC in minutes",
        index_started_step1_title: "Add Dependencies",
        index_started_step2_title: "Define Your Interface",
        index_started_step3_title: "Implement & Use",
        index_started_step3_desc: "Implement the trait for your server, spawn it from your client, and start making calls!",
        index_started_step3_btn: "View Full Demo →",
        index_started_lang_title: "Choose Your Language",
        index_started_rust_title: "Rust",
        index_started_rust_desc: "Full-featured implementation with proc-macros for automatic code generation.",
        index_started_rust_link: "View Rust Crate →",
        index_started_c_title: "C",
        index_started_c_desc: "Core IPC functionality for C projects. Manual serialization required.",
        index_started_c_link: "View C Library →",
        
        // Index page - FAQ Section
        index_faq_title: "Frequently Asked Questions",
        index_faq1_q: "What types can be used in IPC methods?",
        index_faq1_a: "Any type that implements Serialize and Deserialize from serde can be used. This includes all primitive types, standard library types, and custom structs annotated with #[derive(Serialize, Deserialize)].",
        index_faq2_q: "What serialization format is used?",
        index_faq2_a: "CKB Script IPC uses serde_json for message serialization. This provides a good balance between human readability and compatibility.",
        index_faq3_q: "Why is it called IPC instead of RPC?",
        index_faq3_a: "The code operates within a script process that is part of a transaction, and can only run on the same machine. This is more akin to Inter-Process Communication (IPC) rather than Remote Procedure Call (RPC). RPC typically includes features like encryption, authentication, retries, and scaling that aren't relevant in this context.",
        index_faq4_q: "How can I see the generated code?",
        index_faq4_a: "Use cargo-expand to view the code generated by the #[ckb_script_ipc::service] macro.",
        index_faq5_q: "Can I use CKB Script IPC from off-chain code?",
        index_faq5_a: "Yes! Enable the std feature in ckb-script-ipc-common and use native::spawn_server to interact with on-chain script services from native code.",
        
        // Index page - CTA Section
        index_cta_title: "Ready to Build?",
        index_cta_subtitle: "Start building modular, composable CKB contracts today.",
        index_cta_github: "View on GitHub",
        index_cta_examples: "Explore Examples",
        
        // Index page - Footer
        index_footer_tagline: "Building block communication for CKB scripts.",
        index_footer_inspired: "Inspired by",
        
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
        
        // Index page - Navigation
        index_nav_features: "特性",
        index_nav_how_works: "工作原理",
        index_nav_examples: "示例",
        index_nav_faq: "常见问题",
        
        // Index page - Hero Section
        index_hero_badge: "🚀 开源项目",
        index_hero_title: "CKB Script IPC",
        index_hero_subtitle_1: "让 CKB 合约像",
        index_hero_subtitle_2: "积木",
        index_hero_subtitle_3: "一样交互",
        index_hero_description: "一个强大的进程间通信协议，实现 CKB 脚本之间的无缝通信。构建模块化、可重用、可组合的智能合约。",
        index_hero_btn_tutorial: "🎮 开始交互式教程",
        index_hero_btn_learn: "了解更多",
        index_hero_stat1_num: "Rust & C",
        index_hero_stat1_label: "多语言支持",
        index_hero_stat2_num: "VLQ",
        index_hero_stat2_label: "紧凑的传输格式",
        index_hero_stat3_num: "Serde",
        index_hero_stat3_label: "JSON 序列化",
        index_hero_script_a: "脚本 A",
        index_hero_script_b: "脚本 B",
        index_hero_script_c: "脚本 C",
        
        // Index page - Features Section
        index_features_title: "为什么选择 CKB Script IPC？",
        index_features_subtitle: "使用模块化、可重用的组件构建更智能的合约",
        index_feature1_title: "模块化设计",
        index_feature1_desc: "将复杂逻辑拆分为独立脚本，实现无缝通信。一次构建，随处复用。",
        index_feature2_title: "自动代码生成",
        index_feature2_desc: "使用 proc-macros 自动生成 IPC 样板代码。专注于业务逻辑，而非基础设施。",
        index_feature3_title: "简单的序列化",
        index_feature3_desc: "内置 serde 序列化支持。任何实现 Serialize/Deserialize 的类型都可以直接使用。",
        index_feature4_title: "类型安全",
        index_feature4_desc: "编译时强类型检查。在部署前而不是生产中发现错误。",
        index_feature5_title: "紧凑的协议",
        index_feature5_desc: "使用 VLQ（可变长度数量）编码实现高效的传输格式。最小开销，最大性能。",
        index_feature6_title: "多语言支持",
        index_feature6_desc: "提供 Rust 和 C 两种实现。选择最适合你项目的语言。",
        
        // Index page - How It Works Section
        index_how_title: "工作原理",
        index_how_subtitle: "简单的概念，强大的效果",
        index_how_client: "客户端脚本",
        index_how_server: "服务端脚本",
        index_how_request: "请求 (VLQ)",
        index_how_response: "响应 (VLQ)",
        index_protocol_title: "传输协议格式",
        index_protocol_request: "📤 请求数据包",
        index_protocol_response: "📥 响应数据包",
        
        // Index page - Code Examples Section
        index_examples_title: "代码示例",
        index_examples_subtitle: "看看使用 CKB Script IPC 有多简单",
        index_examples_tab1: "1. 定义接口",
        index_examples_tab2: "2. 实现服务端",
        index_examples_tab3: "3. 创建客户端",
        
        // Index page - Use Cases Section
        index_usecases_title: "实际应用场景",
        index_usecases_subtitle: "看看你可以用 CKB Script IPC 构建什么",
        index_usecase1_title: "加密服务",
        index_usecase1_desc: "构建多个脚本可共享的可重用加密服务：",
        index_usecase1_item1: "Blake2b、SHA-256、RIPEMD-160 哈希",
        index_usecase1_item2: "Secp256k1 签名验证",
        index_usecase1_item3: "Schnorr 和 Ed25519 签名",
        index_usecase1_link: "查看示例 →",
        index_usecase2_title: "复杂计算",
        index_usecase2_desc: "将繁重的计算卸载到专门的脚本：",
        index_usecase2_item1: "数学运算",
        index_usecase2_item2: "数据验证逻辑",
        index_usecase2_item3: "协议特定计算",
        index_usecase3_title: "可组合的合约",
        index_usecase3_desc: "构建像乐高积木一样协同工作的合约：",
        index_usecase3_item1: "模块化身份验证",
        index_usecase3_item2: "共享状态管理",
        index_usecase3_item3: "插件架构",
        
        // Index page - Getting Started Section
        index_started_title: "快速开始",
        index_started_subtitle: "几分钟内开始使用 CKB Script IPC",
        index_started_step1_title: "添加依赖",
        index_started_step2_title: "定义接口",
        index_started_step3_title: "实现并使用",
        index_started_step3_desc: "为服务端实现 trait，从客户端启动它，然后开始调用！",
        index_started_step3_btn: "查看完整示例 →",
        index_started_lang_title: "选择你的语言",
        index_started_rust_title: "Rust",
        index_started_rust_desc: "功能完整的实现，使用 proc-macros 自动生成代码。",
        index_started_rust_link: "查看 Rust Crate →",
        index_started_c_title: "C",
        index_started_c_desc: "为 C 项目提供核心 IPC 功能。需要手动序列化。",
        index_started_c_link: "查看 C 库 →",
        
        // Index page - FAQ Section
        index_faq_title: "常见问题",
        index_faq1_q: "IPC 方法可以使用哪些类型？",
        index_faq1_a: "任何实现了 serde 的 Serialize 和 Deserialize 的类型都可以使用。包括所有原始类型、标准库类型以及使用 #[derive(Serialize, Deserialize)] 注解的自定义结构体。",
        index_faq2_q: "使用什么序列化格式？",
        index_faq2_a: "CKB Script IPC 使用 serde_json 进行消息序列化。这在人类可读性和兼容性之间提供了良好的平衡。",
        index_faq3_q: "为什么叫 IPC 而不是 RPC？",
        index_faq3_a: "代码在作为交易一部分的脚本进程中运行，只能在同一台机器上运行。这更类似于进程间通信（IPC）而不是远程过程调用（RPC）。RPC 通常包括加密、身份验证、重试和扩展等在此上下文中不相关的功能。",
        index_faq4_q: "如何查看生成的代码？",
        index_faq4_a: "使用 cargo-expand 查看 #[ckb_script_ipc::service] 宏生成的代码。",
        index_faq5_q: "可以从链下代码使用 CKB Script IPC 吗？",
        index_faq5_a: "可以！在 ckb-script-ipc-common 中启用 std 特性，并使用 native::spawn_server 从原生代码与链上脚本服务交互。",
        
        // Index page - CTA Section
        index_cta_title: "准备好开始了吗？",
        index_cta_subtitle: "立即开始构建模块化、可组合的 CKB 合约。",
        index_cta_github: "在 GitHub 上查看",
        index_cta_examples: "探索示例",
        
        // Index page - Footer
        index_footer_tagline: "CKB 脚本的积木式通信。",
        index_footer_inspired: "灵感来自",
        
        // Language
        lang_switch: "English"
    }
};

// Current language
let currentLang = localStorage.getItem('ckb-ipc-lang') || 'en';

// Get translation
function t(key) {
    const translation = translations[currentLang][key];
    // Return empty string if explicitly set to empty, otherwise fallback
    if (translation === '') return '';
    return translation || translations['en'][key] || key;
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
        
        // Skip if translation is the same as key (not found) or empty
        if (translation === key && !translations.en[key]) {
            return;
        }
        
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
    
    // Update page title based on current page
    const isPlayground = window.location.pathname.includes('playground');
    if (currentLang === 'zh') {
        document.title = isPlayground ? 
            'CKB Script IPC - 交互式教程' : 
            'CKB Script IPC - CKB 脚本的积木式通信';
    } else {
        document.title = isPlayground ? 
            'CKB Script IPC - Interactive Playground' : 
            'CKB Script IPC - Building Block Communication for CKB Scripts';
    }
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
