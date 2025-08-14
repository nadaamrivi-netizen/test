// Test file to validate admin panel functionality
console.log('Testing admin panel files...');

// Test 1: Check if all required functions exist
function testFunctions() {
    console.log('Testing function availability...');
    
    // Test global functions
    const requiredFunctions = [
        'showSection',
        'addNewSkill', 
        'addNewProject',
        'editProject',
        'deleteProject',
        'saveProject',
        'closeModal',
        'openMessage',
        'closeMessageModal',
        'deleteMessage',
        'deleteAllMessages',
        'filterMessages',
        'saveAllChanges',
        'exportData'
    ];
    
    let allFunctionsExist = true;
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.error(`❌ Function ${funcName} is missing`);
            allFunctionsExist = false;
        } else {
            console.log(`✅ Function ${funcName} exists`);
        }
    });
    
    return allFunctionsExist;
}

// Test 2: Check if AdminPanel class exists
function testAdminPanelClass() {
    console.log('Testing AdminPanel class...');
    
    if (typeof AdminPanel === 'function') {
        console.log('✅ AdminPanel class exists');
        return true;
    } else {
        console.error('❌ AdminPanel class is missing');
        return false;
    }
}

// Test 3: Check if MessageHandler class exists
function testMessageHandlerClass() {
    console.log('Testing MessageHandler class...');
    
    if (typeof MessageHandler === 'function') {
        console.log('✅ MessageHandler class exists');
        return true;
    } else {
        console.error('❌ MessageHandler class is missing');
        return false;
    }
}

// Test 4: Check localStorage functionality
function testLocalStorage() {
    console.log('Testing localStorage...');
    
    try {
        localStorage.setItem('test', 'test-value');
        const testValue = localStorage.getItem('test');
        localStorage.removeItem('test');
        
        if (testValue === 'test-value') {
            console.log('✅ localStorage is working');
            return true;
        } else {
            console.error('❌ localStorage test failed');
            return false;
        }
    } catch (error) {
        console.error('❌ localStorage error:', error);
        return false;
    }
}

// Test 5: Check DOM elements
function testDOMElements() {
    console.log('Testing DOM elements...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDOMElementsTest);
    } else {
        runDOMElementsTest();
    }
}

function runDOMElementsTest() {
    const requiredElements = [
        'name',
        'title', 
        'email',
        'phone',
        'location',
        'description',
        'about'
    ];
    
    let allElementsExist = true;
    requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`❌ Element with id '${elementId}' is missing`);
            allElementsExist = false;
        } else {
            console.log(`✅ Element '${elementId}' exists`);
        }
    });
    
    if (allElementsExist) {
        console.log('✅ All required DOM elements exist');
    }
    
    return allElementsExist;
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting admin panel tests...\n');
    
    const results = {
        functions: testFunctions(),
        adminPanelClass: testAdminPanelClass(),
        messageHandlerClass: testMessageHandlerClass(),
        localStorage: testLocalStorage()
    };
    
    // Test DOM elements after a short delay
    setTimeout(() => {
        results.domElements = testDOMElements();
        
        console.log('\n📊 Test Results:');
        console.log('================');
        Object.keys(results).forEach(test => {
            const status = results[test] ? '✅ PASS' : '❌ FAIL';
            console.log(`${test}: ${status}`);
        });
        
        const allPassed = Object.values(results).every(result => result);
        
        if (allPassed) {
            console.log('\n🎉 All tests passed! Admin panel should work correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the errors above.');
        }
    }, 1000);
}

// Auto-run tests when this file is loaded
if (typeof window !== 'undefined') {
    // Run tests after a short delay to ensure all scripts are loaded
    setTimeout(runAllTests, 500);
}

// Export for manual testing
window.testAdminPanel = runAllTests; 