import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとAPIキーを設定
const supabaseUrl = 'YOUR_SUPABASE_URL';  // SupabaseのURL
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';  // SupabaseのAPIキー
const supabase = createClient(supabaseUrl, supabaseKey);

// メッセージを送信する関数
async function sendMessage(messageText) {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            { text: messageText }
        ]);

    if (error) {
        console.error('Error sending message:', error);
    } else {
        console.log('Message sent:', data);
    }
}

// メッセージ送信ボタンにイベントリスナーを追加
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        sendMessage(message);  // メッセージを送信
        messageInput.value = '';  // 入力フィールドをクリア
    }
});

// リアルタイムでメッセージを受信する関数
function receiveMessages() {
    const messagesList = document.getElementById('messages');

    // messagesテーブルの変更を監視
    supabase
        .from('messages')
        .on('INSERT', payload => {
            const message = payload.new;
            const li = document.createElement('li');
            li.textContent = message.text;  // メッセージのテキストを表示
            messagesList.appendChild(li);
        })
        .subscribe();
}

// ページが読み込まれたときにメッセージの受信を開始
document.addEventListener('DOMContentLoaded', () => {
    receiveMessages();
});
