# CodeSys Değişken Adresleyici

Bu web uygulaması, CodeSys PLC değişkenlerini otomatik olarak adreslemenize yardımcı olan modern bir araçtır. Windows Forms uygulamasından web tabanlı bir uygulamaya dönüştürülmüştür.

## Özellikler

- Değişken tiplerini otomatik algılama (INT, REAL, BOOL, DINT)
- Otomatik adres atama
- Türkçe karakter desteği
- Modern ve kullanıcı dostu arayüz
- Üç farklı çıktı formatı:
  - Değişken tanımlamaları
  - IVariable tanımlamaları
  - Değişken oluşturma kodları

## Kullanım

1. Başlangıç adresini girin
2. Değişken listesini giriş alanına yapıştırın
3. "İşle" butonuna tıklayın
4. Sonuçları üç farklı sekmede görüntüleyin

### Giriş Formatı

Değişkenler aşağıdaki formatta olmalıdır:

```
DeğişkenAdı : TİP;
```

Örnek:
```
Motor1_Çalışıyor : BOOL;
Hız_Ayarı : INT;
Sıcaklık : REAL;
Sayaç : DINT;
```

## Kurulum

1. Dosyaları bir web sunucusuna yükleyin
2. `index.html` dosyasını bir web tarayıcısında açın

## Geliştirme

Bu proje aşağıdaki teknolojileri kullanmaktadır:

- HTML5
- CSS3 (Modern Grid ve Flexbox özellikleri)
- JavaScript (ES6+)
- Responsive tasarım

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 