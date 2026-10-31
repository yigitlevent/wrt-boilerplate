#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {name}, from Tauri")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // AppImage webkit2gtk can crash on native Wayland, so force X11. Must be set before GTK can launch.
    #[cfg(target_os = "linux")]
    // SAFETY: no other threads exist yet.
    unsafe {
        std::env::set_var("GDK_BACKEND", "x11");
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
