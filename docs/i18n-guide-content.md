# 📘 i18n Guide Content – Hướng dẫn viết nội dung Guide / Help

Tài liệu này dành cho **developer** và **translator** trong dự án **House of Legacy**.  
Mục tiêu là thống nhất cách viết **nội dung hướng dẫn (Guide / Help / Tutorial)** theo chuẩn i18n, có hỗ trợ định dạng nhưng **an toàn và dễ bảo trì**.

Nội dung được render thông qua helper:


---

## 1. Mục tiêu

Helper `renderI18nWithHighlight` cho phép:

- Định dạng văn bản (bold, italic, underline, strikeline)
- Highlight token (`{{token}}`)
- Xuống dòng bằng \n
- Danh sách (bullet list / numbered list)
- **KHÔNG dùng HTML**
- **KHÔNG dùng dangerouslySetInnerHTML**
- **An toàn XSS**
- Dễ cho translator sử dụng
---

## 2. Quy tắc chung (BẮT BUỘC)

### KHÔNG ĐƯỢC
- Không dùng HTML (`<b>`, `<span>`, `<ul>`, …)
- Không dùng inline CSS
- Không chèn JSX
- Không dùng markdown phức tạp hoặc không được quy ước

### ĐƯỢC PHÉP
- Dùng các ký hiệu định dạng được hỗ trợ
- Dùng token `{{token}}`
- Dùng marker list `[[ul]]`, `[[ol]]`

---

## 3. Định dạng văn bản được hỗ trợ

### 3.1 Bold (in đậm)

```txt
**text**
```
Ví dụ: 
``` 
Chọn vật phẩm **quan trọng**
```

### 3.2 Italic (nghiêng)
- Cú pháp: ``` _text_ ```
- Ví dụ: thêm vào kho
### 3.3 Underline (gạch chân)
- Cú pháp: ``` __text__ ```
- Ví dụ: loại khỏi kho
### 3.4 Strikeline (gạch bỏ)
- Cú pháp: ``` ~~text~~ ```
- Ví dụ: không còn sử dụng
## 4. Highlight token
### 4.1 Cú pháp
- Dạng: ```{{token}}```
- Token chỉ chứa text
- Style và màu sắc do code quyết định
- Translator không thêm style vào language
### 4.2 Token nằm trong định dạng (QUAN TRỌNG)
```
**{{token}}**
__{{token}}__
_{{token}}_
~~{{token}}~~
```
Helper sẽ render đúng:
- Định dạng
- Highlight
- Màu sắc
## 5. Xuống dòng
- Dùng `\n` trong content
- Ví dụ:
```
Dòng 1 \n Dòng 2 \n Không cần <br />
```
## 6. Danh sách (List) – KHUYẾN NGHỊ
### 6.1 Bullet list (UL)
- Dùng marker [[ul]] và [[/ul]]
- Mỗi item bắt đầu bằng -
- Ví dụ:
```
[[ul]]
- Item 1
- Item **{{token}}**
[[/ul]]
```
### 6.2 Numbered list (OL)
- Dùng marker [[ol]] và [[/ol]]
- Mỗi item bắt đầu bằng 1., 2. …
- Ví dụ:
```
[[ol]]
1. Step one
2. Step **{{token}}**
[[/ol]]
```
## 7. Kết hợp list + định dạng + token
- Trong list item có thể dùng:
- Bold / italic / underline / strikeline
- Token {{token}}
- Helper sẽ render đúng trong `<li>`.

## 8. Những lỗi thường gặp
   - Dùng HTML
   - ``` <b>text</b>```
   - ``` <span style="color:red">text</span> ```
   - Thiếu marker kết thúc list
```
     [[ul]]
     - item 1
     - item 2
     (thiếu [[/ul]])
```
  - Đổi tên token
  - {{Right}} ≠ {{right}}

## 9. Checklist cho Translator
- Không có HTML
- Token dùng đúng {{token}}
- List có đủ [[ul]] / [[ol]] và [[/ul]] / [[/ol]]
- Không đổi tên token
- Không thêm khoảng trắng lạ trước - hoặc 1.
## 10. Checklist cho Developer
- Style / màu đặt trong code
- Dùng renderI18nWithHighlight
- Không render raw string content
- Không dùng dangerouslySetInnerHTML
