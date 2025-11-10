package com.example.moduche.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;

public class AESUtil {
    private final String secretKey;

    public AESUtil(String secretKey) {
        this.secretKey = secretKey;
    }

    public String aesEncode(String plainText) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
        IvParameterSpec IV = new IvParameterSpec(secretKey.substring(0, 16).getBytes());
        
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, IV);
        return  Base64.getEncoder().encodeToString(cipher.doFinal(plainText.getBytes()));
    }
    
    public String aesDecode(String cipherText) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
        IvParameterSpec IV = new IvParameterSpec(secretKey.substring(0, 16).getBytes());
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, keySpec, IV);
        byte[] decodedBytes = Base64.getDecoder().decode(cipherText);
        byte[] decrypted = cipher.doFinal(decodedBytes);
        return new String(decrypted, StandardCharsets.UTF_8);
    }
}
